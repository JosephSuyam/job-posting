import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import { email_options, mail_config } from '../config/nodemailer.config';
import { base_url } from '../config/common.config';
import { JobStatus } from '../models/enums/jobs.enum';

type MailOptions = {
  from: string;
  to: string | string[];
  subject: string;
  text: string;
  html: string;
}

type JobData = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  employment_type: string;
}

export const sendJobRequestEmail = async (data: JobData) => {
  const source = fs.readFileSync('./src/helpers/templates/email.handlebars').toString();
  const template = handlebars.compile(source);
  const approval_link: string = `${base_url}/jobs/${JobStatus.APPROVED}/${data.id}`;
  const spam_link: string = `${base_url}/jobs/${JobStatus.SPAM}/${data.id}`;
  const htmlTemplate = template({ ...data, approval_link, spam_link });
  const mail_options: MailOptions = {
    from: email_options.from,
    to: email_options.to,
    subject: 'Job Posting Request',
    text: 'Job Posting Request',
    html: htmlTemplate
  }

  await sendEmail(mail_options);
}

const sendEmail = async (data: MailOptions) => {
  try {
    const transporter = nodemailer.createTransport(mail_config);
    const info = await transporter.sendMail(data);
    console.log(info);
  } catch (e) {
    console.log(e);
  }
}
