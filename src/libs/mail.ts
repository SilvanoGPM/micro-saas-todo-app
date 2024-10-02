import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { env } from '$env';

export interface SendMailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export function sendMail(options: SendMailOptions) {
  const isFakeEmail = fakeEmail(options);

  if (isFakeEmail) {
    return;
  }

  return nodemailerSendMail(options);
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
