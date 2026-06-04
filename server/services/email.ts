import nodemailer from 'nodemailer';

import { DB } from '../db.js';

function getMailTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  return null;
}

export async function sendFulfillmentEmail(
  clientEmail: string,
  clientName: string,
  itemsDescription: string,
  orderId: string
) {
  const transporter = getMailTransporter();
  const subject = `⚡ Consecration Cycle Initialized - Aura & Stone (Order #${orderId})`;

  const textContent = `Greetings ${clientName},\n\nYour payment has been successfully secured. The 3-Nights Purification & Consecration Cycle has been initialized for your items: ${itemsDescription}.\n\nHimalayan Sourcing Coordinates: Jammu, India.\nCertification code: SGD-${orderId}.\n\nDeep regards,\nAura & Stone Private Ltd.`;

  const htmlContent = `
    <div style="font-family: sans-serif; padding: 24px; color: #1C1917; background-color: #FAF7F2; border-radius: 16px; border: 1px solid #EAE6DF; max-width: 600px; margin: 0 auto;">
      <h2 style="font-family: serif; font-size: 20px; border-bottom: 2px solid #D4AF37; padding-bottom: 8px; color: #151313; text-transform: uppercase; letter-spacing: 0.05em;">
        Divine Consecration Chamber
      </h2>
      <p style="font-size: 14px; line-height: 1.6; color: #44403C;">
        Greetings <strong>${clientName}</strong>,
      </p>
      <p style="font-size: 13px; line-height: 1.6; color: #44403C;">
        Your transaction for Order <strong>#${orderId}</strong> has cleared checkout. Your chosen items have been moved into our sacred Himalayan purification chamber:
      </p>
      <blockquote style="background-color: #FDFBF7; border-left: 4px solid #D4AF37; padding: 12px; margin: 16px 0; font-size: 13px; font-style: italic; color: #57534E;">
        ${itemsDescription}
      </blockquote>
      <p style="font-size: 12px; line-height: 1.6; color: #57534E;">
        Over the next 3 nights, Pandit Sharma and Shastri Ji will wash your materials in organic Panchamrut flows, immerse them under moon bathing frequencies, and align their mineral lattices with high-precision 432Hz Saturn and Jupiter acoustic vibrations.
      </p>
      <div style="background-color: #151313; color: #D4AF37; font-family: monospace; font-size: 11px; padding: 10px; border-radius: 8px; margin-top: 16px; text-align: center; border: 1px solid #D4AF37/20;">
        CERTIFICATES SERIES SECURED: CODE SGD-${orderId.substring(6, 12)}
      </div>
      <p style="font-size: 12px; margin-top: 24px; color: #857F75; text-align: center; border-top: 1px solid #EAE6DF; padding-top: 12px;">
        Aura & Stone Private Ltd. • Central Operations • Rishikesh, Uttarakhand, India
      </p>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: '"Aura & Stone Operations" <operations@aurastone.in>',
        to: clientEmail,
        subject,
        text: textContent,
        html: htmlContent,
      });
      await DB.addLog(
        `TRANSACTIONAL EMAIL DESPATCHED: Verification notice sent to client ${clientEmail}`
      );
    } catch (err: any) {
      console.error('Email dispatch error', err);
      await DB.addLog(`EMAIL ANOMALY: Failed to dispatch real SMTP transmission.`);
    }
  } else {
    console.log(`[SMTP SIMULATION] sending email to ${clientEmail}`);
    await DB.addLog(`EMAIL SIMULATOR INTERACTION: Mock receipt transmitted to: ${clientEmail}`);
  }
}
