import nodemailer, { SendMailOptions } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { env } from '$env';

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  auth: {
    user: env.EMAIL_USERNAME,
    pass: env.EMAIL_PASSWORD,
  },
});

export function sendMail(options: SendMailOptions) {
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
