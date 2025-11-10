
const nodemailer = require("nodemailer");

// Create transporter once and reuse it — faster + avoids TLS issues
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify SMTP on startup
async function verifyTransporter() {
  return transporter.verify();
}

// Consistent sendMail helper (supports attachments)
async function sendMail({ to, subject, text, html, attachments = [] }) {
  return transporter.sendMail({
    from: `"Munc Inventory" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
    attachments,
  });
}

module.exports = { sendMail, verifyTransporter };