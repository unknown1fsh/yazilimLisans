import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) return NextResponse.json({ error: "Geçersiz kullanıcı" }, { status: 401 });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Geçersiz şifre" }, { status: 401 });
  await createSession({ userId: user.id, email: user.email });
  return NextResponse.json({ ok: true });
}


