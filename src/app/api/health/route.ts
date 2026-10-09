import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Railway healthcheck target: "/" redirects to the localized shop, which healthchecks treat as a failure.
export function GET() {
  return NextResponse.json({ ok: true });
}
