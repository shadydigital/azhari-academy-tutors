import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { issueApplicationAccess } from "@/lib/applications";
import { sendApplicationAccessEmail } from "@/lib/email";
import { normalizeEmail } from "@/lib/security";

export const runtime = "nodejs";

const bodySchema = z.object({ email: z.email().max(190), locale: z.enum(["en", "ar"]).default("en") });

export async function POST(request: NextRequest) {
  try {
    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
    const email = normalizeEmail(parsed.data.email);
    const access = await issueApplicationAccess(email, parsed.data.locale);
    const baseUrl = process.env.APP_URL || request.nextUrl.origin;
    const url = `${baseUrl}/${parsed.data.locale}/apply?token=${encodeURIComponent(access.rawToken)}`;
    const emailSent = await sendApplicationAccessEmail({ email, locale: parsed.data.locale, url });
    if (process.env.NODE_ENV === "production" && !emailSent) {
      return NextResponse.json({ message: "Email delivery is not configured." }, { status: 503 });
    }
    return NextResponse.json({ ok: true, devToken: process.env.NODE_ENV === "production" ? undefined : access.rawToken });
  } catch (error) {
    console.error("Unable to start application", error);
    return NextResponse.json({ message: "The application service is temporarily unavailable." }, { status: 503 });
  }
}
