import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import React from 'react';

import { env } from '$env';

import mailwindCss from './css';
import { parseImages } from './images';
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
  const data = await templates[template].parseAsync(rawData);

  const ReactDOMServer = (await import('react-dom/server')).default;
  const Component = (await import(`./templates/${template}`)).default;

  const rawHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Component, data),
  );

  const styledHtml = await mailwindCss(rawHtml, {
    tailwindCss: './src/libs/mail/styles.css',
  });

  const [html, attachments] = await parseImages(styledHtml, {
    assetsFolder: './src/libs/mail/assets',
  });

  return sendMail({
    to,
    subject,
    html,
    attachments,
  });
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
