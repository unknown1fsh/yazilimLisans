import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { createSession } from "@/app/lib/auth";

const schema = z.object({
  userType: z.enum(["PERSONAL", "COMPANY"]),
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(5),
  address: z.string().min(5),
  tcKimlikNo: z.string().optional(),
  vergiKimlikNo: z.string().optional(),
  companyName: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }
  const data = parsed.data;

  if (data.userType === "PERSONAL" && !data.tcKimlikNo) {
    return NextResponse.json({ error: "TC Kimlik No gerekli" }, { status: 400 });
  }
  if (data.userType === "COMPANY" && !data.vergiKimlikNo) {
    return NextResponse.json({ error: "Vergi Kimlik No gerekli" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      userType: data.userType as any,
      phone: data.phone,
      address: data.address,
      tcKimlikNo: data.userType === "PERSONAL" ? data.tcKimlikNo : null,
      vergiKimlikNo: data.userType === "COMPANY" ? data.vergiKimlikNo : null,
      companyName: data.companyName ?? null,
      passwordHash,
    },
  });

  await createSession({ userId: user.id, email: user.email });

  return NextResponse.json({ ok: true });
}


