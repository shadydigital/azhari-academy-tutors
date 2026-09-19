import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveDraft } from "@/lib/applications";

export const runtime = "nodejs";

const schema = z.object({ step: z.number().int().min(0).max(10), locale: z.enum(["en", "ar"]), data: z.record(z.string(), z.unknown()) });

export async function PATCH(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return NextResponse.json({ message: "Your secure link is missing or expired." }, { status: 401 });
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ message: "Some application data is invalid." }, { status: 400 });
    const application = await saveDraft(token, parsed.data.step, parsed.data.data, parsed.data.locale);
    if (!application) return NextResponse.json({ message: "Your secure link is invalid or the application has already been submitted." }, { status: 401 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unable to save draft", error);
    return NextResponse.json({ message: "We could not save your progress. Please try again." }, { status: 503 });
  }
}
