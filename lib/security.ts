import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString("base64url");
}

export function hashToken(token: string) {
  const secret = process.env.TOKEN_SECRET;
  if (!secret || secret.length < 32) throw new Error("TOKEN_SECRET must contain at least 32 characters");
  return createHash("sha256").update(`${secret}:${token}`).digest("hex");
}

export function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function clientIp(headers: Headers) {
  return (headers.get("x-forwarded-for") || headers.get("x-real-ip") || "unknown").split(",")[0].trim();
}
