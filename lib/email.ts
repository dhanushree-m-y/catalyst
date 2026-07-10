import nodemailer from "nodemailer";

/** Email sends through the Catalyst Gmail account (needs an app password). */
export function emailConfigured(): boolean {
  return !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

let transporter: nodemailer.Transporter | null = null;
function getTransport() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    });
  }
  return transporter;
}

export async function sendVerificationEmail(to: string, code: string): Promise<boolean> {
  if (!emailConfigured()) return false;
  const from = `Catalyst <${process.env.GMAIL_USER}>`;
  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:8px">
    <div style="background:linear-gradient(135deg,#ff6fb0,#ec3e93);color:#fff;border-radius:16px;padding:26px 24px;text-align:center">
      <div style="font-size:22px;font-weight:800;letter-spacing:.5px">Catalyst</div>
      <div style="opacity:.9;font-size:13px;margin-top:4px">Verify your email</div>
    </div>
    <div style="padding:26px 8px;color:#4a1330">
      <p style="font-size:15px;line-height:1.5">Use this code to verify your Catalyst account:</p>
      <div style="font-size:34px;font-weight:800;letter-spacing:8px;color:#ec3e93;text-align:center;margin:18px 0">${code}</div>
      <p style="font-size:13px;color:#9a6b7d">This code expires in 15 minutes. If you didn't request it, you can ignore this email.</p>
    </div>
  </div>`;
  await getTransport().sendMail({
    from,
    to,
    subject: `Your Catalyst verification code: ${code}`,
    text: `Your Catalyst verification code is ${code}. It expires in 15 minutes.`,
    html,
  });
  return true;
}
