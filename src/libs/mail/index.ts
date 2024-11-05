import { readFile } from 'fs/promises';

import Handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { env } from '$env';

import { TemplateData, TemplateName, templates } from './templates';

export interface SendMailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: nodemailer.SendMailOptions['attachments'];
}

export interface SendTemplateMailOptions<T extends TemplateName> {
  to: string;
  subject: string;
  data: TemplateData<T>;
}

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,

  auth: {
    user: env.EMAIL_USERNAME,
    pass: env.EMAIL_PASSWORD,
  },
});

function nodemailerSendMail(options: SendMailOptions) {
  return new Promise<SMTPTransport.SentMessageInfo>((resolve, reject) => {
    transporter.sendMail(
      {
        ...options,
        from: env.EMAIL_FROM,
        attachDataUrls: true,
      },
      (error, data) => {
        if (error) {
          return reject(error);
        }

        return resolve(data);
      },
    );
  });
}

function fakeEmail(options: SendMailOptions) {
  if (
    env.NEXT_PUBLIC_USE_FAKES === 'true' ||
    env.NEXT_PUBLIC_USE_FAKES?.split(',').includes('email')
  ) {
    console.log(`Fake email sent from ${env.EMAIL_FROM}:`, options);

    return true;
  }

  return false;
}

export function sendMail(options: SendMailOptions) {
  const isFakeEmail = fakeEmail(options);

  if (isFakeEmail) {
    return;
  }

  return nodemailerSendMail(options);
}

export async function sendTemplateMail<T extends TemplateName>(
  template: T,
  { subject, to, data: rawData }: SendTemplateMailOptions<T>,
) {
  const data = await templates[template].validation.parseAsync(rawData);
  const defaultValues = templates[template]?.defaultValues || {};

  const sharedData = {
    base_url: env.NEXT_PUBLIC_APP_URL!,
    year: new Date().getFullYear(),
  };

  const templatePath = `./src/libs/mail/templates/${template}.hbs`;
  const templateContent = await readFile(templatePath, 'utf-8');
  const templateCompiled = Handlebars.compile(templateContent);
  const html = templateCompiled({ ...defaultValues, ...data, ...sharedData });

  return sendMail({
    to,
    subject,
    html,
  });
}
