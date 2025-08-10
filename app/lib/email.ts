import nodemailer from "nodemailer";

export type LicenseEmailItem = {
  productTitle: string;
  licenseKey: string | null;
  quantity: number;
};

export async function sendLicenseEmail(to: string, orderId: number, items: LicenseEmailItem[]) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user || "no-reply@example.com";
  if (!host || !user || !pass) {
    console.warn("SMTP env eksik, e-posta atlanıyor");
    return;
  }
  const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
  const lines = items.map((i) => `- ${i.productTitle} x${i.quantity}: ${i.licenseKey ?? "(anahtar daha sonra iletilecek)"}`).join("\n");
  const text = `Siparişiniz (No: ${orderId}) başarıyla tamamlandı.\n\nLisans anahtarlarınız:\n${lines}\n\nTeşekkürler.`;
  await transporter.sendMail({ from, to, subject: `Sipariş #${orderId} - Lisans Anahtarları`, text });
}


