import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { z } from "zod";
import { getCurrentUser } from "@/app/lib/auth";
import { sendLicenseEmail } from "@/app/lib/email";

const checkoutSchema = z.object({
  email: z.string().email(),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().min(1).max(50),
      })
    )
    .min(1),
  provider: z.enum(["iyzico", "paytr", "mock"]).default("mock"),
});

export async function POST(req: NextRequest) {
  // Hem JSON hem form post desteği
  let body: any;
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    body = await req.json();
  } else if (contentType.includes("application/x-www-form-urlencoded")) {
    const form = await req.formData();
    body = {
      email: form.get("email"),
      provider: form.get("provider") ?? "mock",
      items: (() => {
        try {
          const raw = form.get("items") as string;
          return JSON.parse(raw);
        } catch {
          return [];
        }
      })(),
    };
  } else {
    body = await req.json().catch(() => ({}));
  }
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Geçersiz istek", details: parsed.error.format() },
      { status: 400 }
    );
  }

  let { email, items, provider } = parsed.data;
  const session = await getCurrentUser();
  // items boşsa sepettekilerle öde
  if ((!items || items.length === 0) && session?.userId) {
    const cart = await prisma.cart.findFirst({
      where: { userId: session.userId },
      include: { items: true },
    });
    items = (cart?.items || []).map((i) => ({ productId: i.productId, quantity: i.quantity }));
  }

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) }, isActive: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p] as const));
  const orderItemsData = items.map((i) => {
    const p = productMap.get(i.productId);
    if (!p) throw new Error("Ürün bulunamadı veya pasif");
    return {
      productId: p.id,
      quantity: i.quantity,
      unitPrice: p.price,
      productSnapshot: {
        id: p.id,
        title: p.title,
        price: p.price,
      },
    };
  });

  const totalAmount = orderItemsData.reduce((acc, i) => acc + Number(i.unitPrice) * i.quantity, 0);

  const order = await prisma.order.create({
    data: {
      userId: session?.userId ?? null,
      email,
      totalAmount,
      status: "PENDING",
      orderItems: { create: orderItemsData },
      paymentProvider: provider,
    },
    include: { orderItems: true },
  });

  // Iyzico anahtarları yoksa güvenli biçimde mock'a düş
  if (
    provider === "iyzico" &&
    (!process.env.IYZI_API_KEY || !process.env.IYZI_SECRET_KEY || !process.env.IYZI_BASE_URL)
  ) {
    provider = "mock";
  }

  // Mock provider: başarılı ödeme simülasyonu ve ödeme sonucu sayfasına yönlendirme
  if (provider === "mock") {
    // Uygun lisans anahtarlarını sırayla ata
    for (const item of order.orderItems) {
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

    const paid = await prisma.order.update({
      where: { id: order.id },
      data: { status: "PAID", paymentRef: `MOCK-${order.id}` },
      include: { orderItems: { include: { licenseKey: true } } },
    });
    // Ödeme sonrası kullanıcının sepetini temizle
    if (session?.userId) {
      const cart = await prisma.cart.findFirst({ where: { userId: session.userId } });
      if (cart) {
        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      }
    }
    const appUrl = process.env.APP_URL || "http://localhost:3000";
    // E-posta gönderimi
    await sendLicenseEmail(
      email,
      paid.id,
      paid.orderItems.map((i) => ({
        productTitle: productMap.get(i.productId)?.title ?? "Ürün",
        licenseKey: i.licenseKey?.key ?? null,
        quantity: i.quantity,
      }))
    );
    return NextResponse.redirect(`${appUrl}/payment/${paid.id}`);
  }

  if (provider === "iyzico") {
    const appUrl = process.env.APP_URL || "http://localhost:3000";
    const redirectUrl = `${appUrl}/payment/mock-gateway?orderId=${order.id}&provider=iyzico`;
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/x-www-form-urlencoded")) {
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.json({ ok: true, orderId: order.id, redirectUrl });
  }

  return NextResponse.json({ ok: true, orderId: order.id });
}


