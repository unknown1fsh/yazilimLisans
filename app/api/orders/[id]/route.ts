import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!id) return NextResponse.json({ error: "Geçersiz id" }, { status: 400 });
  const order = await prisma.order.findUnique({
    where: { id },
    include: { orderItems: { include: { product: true, licenseKey: true } } },
  });
  if (!order) return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
  return NextResponse.json(order);
}


