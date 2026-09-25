import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

let transporter = null;

if (env.smtp.host && env.smtp.user && env.smtp.pass) {
  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: { user: env.smtp.user, pass: env.smtp.pass },
  });
}

export const sendEmail = async ({ to, subject, html }) => {
  if (!transporter) {
    console.log(`[EMAIL SKIPPED] to=${to} subject=${subject}`);
    return;
  }
  try {
    await transporter.sendMail({ from: env.smtp.from, to, subject, html });
  } catch (e) {
    console.error('Email failed:', e.message);
  }
};