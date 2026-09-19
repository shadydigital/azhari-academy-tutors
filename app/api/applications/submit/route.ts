import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { submitApplication } from "@/lib/applications";
import { sendApplicationConfirmation } from "@/lib/email";

export const runtime = "nodejs";

const submissionSchema = z.object({
  locale: z.enum(["en", "ar"]),
  data: z.object({
    fullNameEnglish: z.string().trim().min(2).max(150),
    fullNameArabic: z.string().trim().min(2).max(150),
    phone: z.string().trim().min(7).max(40),
    country: z.string().trim().min(2).max(100),
    gender: z.enum(["male", "female"]),
    over18: z.literal(true),
    institution: z.string().trim().min(2).max(180),
    qualification: z.string().trim().min(2).max(180),
    specializations: z.array(z.string()).min(1),
    ageGroups: z.array(z.string()).min(1),
    teachingLanguages: z.string().trim().min(2).max(300),
    yearsExperience: z.string().min(1),
    motivation: z.string().trim().min(20).max(4000),
    weeklyHours: z.string().min(1),
    availability: z.string().trim().min(5).max(2000),
    consentAccuracy: z.literal(true),
    consentPrivacy: z.literal(true)
  }).passthrough()
});

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return NextResponse.json({ message: "Your secure link is missing or expired." }, { status: 401 });
    const parsed = submissionSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ message: "Please complete all required fields before submitting." }, { status: 400 });
    const application = await submitApplication(token, parsed.data.data, parsed.data.locale);
    if (!application) return NextResponse.json({ message: "This application has already been submitted or the link has expired." }, { status: 409 });
    await sendApplicationConfirmation({ email: application.email, locale: parsed.data.locale, reference: application.reference_number });
    return NextResponse.json({ ok: true, reference: application.reference_number });
  } catch (error) {
    console.error("Unable to submit application", error);
    return NextResponse.json({ message: "We could not submit your application. Please try again." }, { status: 503 });
  }
}
