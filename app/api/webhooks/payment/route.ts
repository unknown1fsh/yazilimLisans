import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// Sanal POS sağlayıcılarından ödeme callback'i almak için genel webhook
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  const orderId = Number(body.orderId);
  const status = String(body.status || "").toUpperCase(); // PAID | FAILED | REFUNDED
  const paymentRef = String(body.paymentRef || "");

  if (!orderId || !["PAID", "FAILED", "REFUNDED"].includes(status)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: status as any, paymentRef },
    include: { orderItems: true },
  });

  // Başarılı ödeme sonrası lisans anahtarlarını atama (idempotent yaklaşım)
  if (status === "PAID") {
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
    // Sepeti temizle
    if (order.userId) {
      const cart = await prisma.cart.findFirst({ where: { userId: order.userId } });
      if (cart) {
        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      }
    }
  }

  return NextResponse.json({ ok: true });
}


