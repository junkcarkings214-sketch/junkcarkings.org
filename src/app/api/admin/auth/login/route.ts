import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  isAuthConfigured,
  resetRateLimit,
  setSessionCookie,
  verifyAdminPassword,
} from "@/lib/admin/auth";

export async function POST(req: NextRequest) {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Admin access isn't configured on this server yet (ADMIN_PASSWORD env var is missing).",
      },
      { status: 503 },
    );
  }

  let password = "";
  try {
    const body = (await req.json()) as { password?: unknown };
    if (typeof body.password === "string") password = body.password;
  } catch {
    // fallthrough: empty password
  }

  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "local";
  const gate = checkRateLimit(`login:${ip}`);
  if (!gate.allowed) {
    return NextResponse.json(
      { ok: false, error: `Too many attempts. Try again in ${gate.retryAfterSec}s.` },
      { status: 429, headers: { "Retry-After": String(gate.retryAfterSec) } },
    );
  }

  if (!verifyAdminPassword(password)) {
    // Delay brute-force attempts slightly; wrong password never returns.
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 400));
    return NextResponse.json(
      { ok: false, error: "Incorrect password." },
      { status: 401 },
    );
  }

  resetRateLimit(`login:${ip}`);
  await setSessionCookie();
  return NextResponse.json({ ok: true });
}
