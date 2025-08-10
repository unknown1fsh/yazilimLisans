import { NextRequest, NextResponse } from "next/server";
import { createIyziClient } from "@/app/lib/iyzico";
import { prisma } from "@/app/lib/prisma";
import { sendLicenseEmail } from "@/app/lib/email";

// Iyzico ödeme sonrası callback. Iyzipay docs: threeds | checkoutform callback
export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  // Iyzico genelde x-www-form-urlencoded gönderir
  const form = contentType.includes("application/json")
    ? await req.json()
    : Object.fromEntries((await req.formData()).entries());

  const token = (form.token || form.paymentToken || "") as string;
  const orderId = Number(form.orderId || form.basketId || 0);

  if (!token || !orderId) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const iyzi = createIyziClient();

  // Token ile ödeme durumunu sorgula
  const result: any = await new Promise((resolve, reject) => {
    // @ts-ignore
    iyzi.checkoutForm.retrieve({ token }, (err: any, res: any) => {
      if (err) reject(err);
      else resolve(res);
    });
  });

  const status = String(result?.paymentStatus || "FAILURE").toUpperCase();
  const paymentRef = String(result?.paymentId || token);

  const newStatus = status === "SUCCESS" ? "PAID" : "FAILED";

  await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus as any, paymentRef: paymentRef },
  });

  // PAID ise lisans ataması webhook mantığına benzer yapılır
  if (newStatus === "PAID") {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: { include: { product: true, licenseKey: true } } },
    });
    if (order) {
      for (const item of order.orderItems) {
        if (item.licenseKeyId) continue;
        const availableKey = await prisma.licenseKey.findFirst({
          where: { productId: item.productId, isAssigned: false },
          orderBy: { id: "asc" },
        });
        if (availableKey) {
          await prisma.$transaction([
            prisma.licenseKey.update({
              where: { id: availableKey.id },
              data: { isAssigned: true, assignedAt: new Date() },
            }),
            prisma.orderItem.update({
              where: { id: item.id },
              data: { licenseKeyId: availableKey.id },
            }),
          ]);
        }
      }
      await sendLicenseEmail(
        order.email,
        order.id,
        order.orderItems.map((i) => ({
          productTitle: i.product.title,
          licenseKey: i.licenseKey?.key ?? null,
          quantity: i.quantity,
        }))
      );
    }
  }

  return NextResponse.json({ ok: true });
}


