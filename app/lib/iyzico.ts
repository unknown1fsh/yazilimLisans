import Iyzipay from "iyzipay";

export function createIyziClient() {
  const apiKey = process.env.IYZI_API_KEY as string;
  const secretKey = process.env.IYZI_SECRET_KEY as string;
  const uri = process.env.IYZI_BASE_URL as string;
  if (!apiKey || !secretKey || !uri) {
    throw new Error("Iyzico env ayarları eksik");
  }
  return new Iyzipay({ apiKey, secretKey, uri });
}

export function getBaseUrls() {
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";
  return {
    callbackUrl: `${appUrl}/api/payment/iyzico/callback`,
    successUrl: `${appUrl}/payment/success`, // opsiyonel
  };
}


