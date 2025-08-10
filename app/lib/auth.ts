import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "session";
const alg = "HS256";

export type SessionPayload = {
  userId: number;
  email: string;
};

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET || "dev_secret_change_me";
  return new TextEncoder().encode(secret);
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
  const c = await cookies();
  c.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}

export async function getCurrentUser(): Promise<SessionPayload | null> {
  try {
    const c = await cookies();
    const token = c.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, getSecret());
    const userId = Number(payload.userId);
    const email = String(payload.email);
    if (!userId || !email) return null;
    return { userId, email };
  } catch {
    return null;
  }
}


