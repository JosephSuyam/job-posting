type MailerConfig = {
  service: string,
  host: string,
  port: number,
  secure: boolean,
  auth: {
    user: string,
    pass: string,
  },
}

type EmailOptions = {
  from: string,
  to: string | string[],
  cc?: string | string[],
  bcc?: string | string[],
}

export const mail_config: MailerConfig = {
  service: String(process.env.SMTP_SERVICE),
  host: String(process.env.SMTP_HOST),
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: String(process.env.SMTP_USERNAME),
    pass: String(process.env.SMTP_PASSWORD),
  }
};

export const email_options: EmailOptions = {
  from: String(process.env.EMAIL_SENDER),
  to: String(process.env.EMAIL_RECEIVER),
}
