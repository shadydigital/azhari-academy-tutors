import { NextResponse } from "next/server";
import { destroyStaffSession } from "@/lib/admin-auth";

export async function POST() {
  await destroyStaffSession();
  return NextResponse.json({ ok: true });
}
