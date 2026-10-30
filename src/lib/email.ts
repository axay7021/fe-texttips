import nodemailer from 'nodemailer';
import config from '@/config';
import constants from '@/constants';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_PORT === '465',
  requireTLS: process.env.SMTP_PORT !== '465',
  connectionTimeout: 15000,
  socketTimeout: 20000,
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASSWORD,
  },
});

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) => {
  try {
    if (!config.SMTP_USER || !config.SMTP_PASSWORD)
      throw new Error('Email delivery is not configured.');
    const info = await transporter.sendMail({
      from: {
        name: constants.APP_NAME,
        address: process.env.SMTP_FROM || config.SMTP_USER,
      },
      to,
      subject,
      html,
      text,
    });

    return { success: true, data: info };
  } catch (err) {
    // biome-ignore lint/suspicious/noConsole: Allow logging
    console.error('Nodemailer error:', err);
    throw new Error('Email could not be delivered. Please try again later.');
  }
};

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        char
      ] || char,
  );
}

interface EmailVerificationData {
  user: {
    name: string;
    email: string;
  };
  url: string;
}

export async function sendEmailVerificationEmail({
  user,
  url,
}: EmailVerificationData) {
  await sendEmail({
    to: user.email,
    subject: 'Verify your email address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Verify Your Email</h2>
        <p>Hello ${escapeHtml(user.name)},</p>
        <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
        <a href="${escapeHtml(url)}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0;">Verify Email</a>
        <p>If you didn't create an account, please ignore this email.</p>
        <p>This link will expire in one hour.</p>
        <p>Best regards,<br>Your App Team</p>
      </div>
    `,
    text: `Hello ${escapeHtml(user.name)},\n\nThank you for signing up! Please verify your email address by clicking this link: ${url}\n\nIf you didn't create an account, please ignore this email.\n\nThis link will expire in one hour.\n\nBest regards,\nYour App Team`,
  });
}

export function sendPasswordResetEmail({
  user,
  url,
}: {
  user: { email: string; name: string };
  url: string;
}) {
  return sendEmail({
    to: user.email,
    subject: 'Reset your password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p>Hello ${escapeHtml(user.name)},</p>
        <p>You requested to reset your password. Click the button below to reset it:</p>
        <a href="${escapeHtml(url)}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0;">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in one hour.</p>
        <p>Best regards,<br>Your App Team</p>
      </div>
    `,
    text: `Hello ${escapeHtml(user.name)},\n\nYou requested to reset your password. Click this link to reset it: ${url}\n\nIf you didn't request this, please ignore this email.\n\nThis link will expire in one hour.\n\nBest regards,\nYour App Team`,
  });
}
