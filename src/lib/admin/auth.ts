import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Minimal, genuinely-secure admin authentication pending the business's move
 * to Supabase Auth:
 *
 * - Password lives only in the `ADMIN_PASSWORD` environment variable.
 * - There is no hardcoded/default password: the login endpoint cannot
 *   succeed until the variable is set.
 * - Sessions are HMAC-signed tokens in an httpOnly, sameSite=lax cookie.
 * - Login attempts are rate limited in memory.
 * - `requireAdmin()` is called on every admin page + every admin API route.
 *
 * Swapping to Supabase Auth later only requires replacing the two helpers
 * below — page/route code keeps calling `requireAdmin()`.
 */

export const ADMIN_COOKIE = "jck_admin_session";
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days
const MAX_ATTEMPTS = 8;
const RATE_WINDOW_MS = 15 * 60 * 1000;

const adminPassword = () => process.env.ADMIN_PASSWORD ?? "";

export function isAuthConfigured(): boolean {
  return adminPassword().length >= 8;
}

/** Constant-time compare of the provided password against `ADMIN_PASSWORD`. */
export function verifyAdminPassword(candidate: string): boolean {
  const expected = adminPassword();
  if (expected.length < 8 || candidate.length !== expected.length) {
    // Burn a hash round anyway to keep timing broadly uniform.
    createHash("sha256").update(candidate).digest();
    return false;
  }
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function sessionSecret(): Buffer {
  const explicit = process.env.ADMIN_SESSION_SECRET;
  if (explicit && explicit.length >= 16) {
    return Buffer.from(explicit, "utf8");
  }
  // Fallback binds the secret to the configured password instead of shipping
  // a hardcoded key. Verify flow still fails with an unset password.
  return createHash("sha256")
    .update(`jck-admin:${adminPassword()}`)
    .digest();
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function createSessionToken(): {
  token: string;
  maxAge: number;
} {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const nonce = randomBytes(8).toString("hex");
  const payload = `${exp}.${nonce}`;
  return { token: `${payload}.${sign(payload)}`, maxAge: SESSION_TTL_SECONDS };
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [expRaw, nonce, sig] = parts;
  const exp = Number(expRaw);
  if (!Number.isInteger(exp) || exp * 1000 < Date.now()) return false;

  const expected = Buffer.from(sign(`${expRaw}.${nonce}`));
  const provided = Buffer.from(sig);
  return expected.length === provided.length && timingSafeEqual(expected, provided);
}

// ---------------------------------------------------------------------------
// In-memory rate limiting (per server instance; also a deterrent, not a WAF).
// ---------------------------------------------------------------------------

const attempts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true, retryAfterSec: 0 };
  }
  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count += 1;
  return { allowed: true, retryAfterSec: 0 };
}

export function resetRateLimit(key: string): void {
  attempts.delete(key);
}

// ---------------------------------------------------------------------------
// Request helpers
// ---------------------------------------------------------------------------

/** Returns true when the current request has a valid admin session cookie. */
export async function hasAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
}

/**
 * Guard every admin page. Must be rendered inside a Suspense boundary
 * (Next.js Cache Components requires async request data be deferred).
 */
export async function requireAdmin(): Promise<void> {
  if (!(await hasAdminSession())) {
    redirect("/admin/login");
  }
}

export async function setSessionCookie(): Promise<void> {
  const { token, maxAge } = createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}
