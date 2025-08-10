import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

async function getOrCreateCart(userId: number) {
  let cart = await prisma.cart.findFirst({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }
  return cart;
}

export async function GET() {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ items: [], requiresLogin: true });
  const cart = await prisma.cart.findFirst({
    where: { userId: session.userId },
    include: { items: { include: { product: true } } },
  });
  return NextResponse.json(cart ?? { items: [] });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Giriş yapınız" }, { status: 401 });
  const { productId, quantity } = await req.json();
  const cart = await getOrCreateCart(session.userId);
  const existing = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } });
  if (existing) {
    await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: existing.quantity + (quantity || 1) } });
  } else {
    await prisma.cartItem.create({ data: { cartId: cart.id, productId, quantity: quantity || 1 } });
  }
  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Giriş yapınız" }, { status: 401 });
  const { itemId, quantity } = await req.json();
  await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Giriş yapınız" }, { status: 401 });
  const { itemId } = await req.json();
  await prisma.cartItem.delete({ where: { id: itemId } });
  return NextResponse.json({ ok: true });
}


