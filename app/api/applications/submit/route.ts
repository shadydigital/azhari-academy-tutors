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
    country: z.string().trim().length(2),
    city: z.string().trim().min(2).max(100),
    timezone: z.string().trim().min(3).max(100),
    gender: z.enum(["male", "female"]),
    over18: z.literal(true),
    azharStatus: z.enum(["graduate", "student", "other"]),
    institution: z.string().trim().min(2).max(180),
    institutionOther: z.string().trim().max(180).optional(),
    qualification: z.string().trim().min(2).max(180),
    graduationYear: z.union([z.literal(""), z.literal("not_graduated"), z.string().regex(/^\d{4}$/)]),
    hasIjazah: z.enum(["yes", "no"]),
    specializations: z.array(z.string()).min(1),
    ageGroups: z.array(z.string()).min(1),
    teachingLanguages: z.array(z.object({
      language: z.string().min(2).max(30),
      level: z.enum(["native", "fluent", "advanced", "intermediate", "basic"]),
      otherLanguage: z.string().trim().max(80).optional()
    })).min(1),
    yearsExperience: z.string().regex(/^\d{1,2}$/),
    onlineExperience: z.string().trim().min(10).max(4000),
    motivation: z.string().trim().min(20).max(4000),
    childScenario: z.string().trim().min(20).max(4000),
    weeklyHours: z.string().regex(/^\d{1,2}$/),
    earliestStart: z.iso.date(),
    availability: z.array(z.object({
      day: z.enum(["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]),
      enabled: z.boolean(),
      from: z.string().max(5),
      to: z.string().max(5)
    })).refine((slots) => slots.some((slot) => slot.enabled && slot.from && slot.to), "Select at least one complete availability period"),
    device: z.enum(["desktop", "laptop", "tablet", "smartphone", "other"]),
    deviceOther: z.string().trim().max(120).optional(),
    internet: z.enum(["fiber", "vdsl", "fixed-wireless", "mobile-data", "other"]),
    internetBackup: z.enum(["mobile-data", "second-line", "portable-router", "other", "none"]),
    links: z.array(z.object({ type: z.string().min(2).max(30), url: z.url().max(2000) })).max(10),
    consentAccuracy: z.literal(true),
    consentPrivacy: z.literal(true)
  }).passthrough().superRefine((data, context) => {
    if (data.institution === "other" && !data.institutionOther) context.addIssue({ code: "custom", path: ["institutionOther"], message: "Enter the institution name" });
    if (data.device === "other" && !data.deviceOther) context.addIssue({ code: "custom", path: ["deviceOther"], message: "Enter the device details" });
    data.teachingLanguages.forEach((item, index) => {
      if (item.language === "other" && !item.otherLanguage) context.addIssue({ code: "custom", path: ["teachingLanguages", index, "otherLanguage"], message: "Enter the language name" });
    });
  })
});

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return NextResponse.json({ message: "Your secure link is missing or expired." }, { status: 401 });
    const body = await request.json();
    const parsed = submissionSchema.safeParse(body);
    if (!parsed.success) {
      const fields = [...new Set(parsed.error.issues.map((issue) => String(issue.path[1] || "application")))];
      return NextResponse.json({
        message: body?.locale === "ar" ? "يرجى مراجعة الحقول الموضحة وإكمالها قبل الإرسال." : "Please review the highlighted fields before submitting.",
        fields
      }, { status: 400 });
    }
    const application = await submitApplication(token, parsed.data.data, parsed.data.locale);
    if (!application) return NextResponse.json({ message: "This application has already been submitted or the link has expired." }, { status: 409 });
    await sendApplicationConfirmation({ email: application.email, locale: parsed.data.locale, reference: application.reference_number });
    return NextResponse.json({ ok: true, reference: application.reference_number });
  } catch (error) {
    console.error("Unable to submit application", error);
    return NextResponse.json({ message: "We could not submit your application. Please try again." }, { status: 503 });
  }
}
