/**
 * Dev utility: authenticated admin dashboard checks.
 * First log in, then run this script with ADMIN_COOKIE set to the session
 * cookie value returned by the login call below, e.g.:
 *   node scripts/dev-tests/admin-login.mjs                # prints cookie
 *   ADMIN_COOKIE=<cookie> node scripts/dev-tests/admin-e2e.mjs
 * Assumes at least one real submission exists (.data/submissions/…).
 */
import { readdir } from "node:fs/promises";
import { join } from "node:path";

const BASE = process.env.BASE ?? "http://localhost:3000";
const COOKIE = process.env.ADMIN_COOKIE ?? "";

const dataDir = join(process.cwd(), ".data", "submissions");
const ids = await readdir(dataDir).catch(() => []);
const sample = ids[0];
if (!sample) {
  console.error("No submissions found — submit one first (scripts/dev-tests/submission-e2e.mjs).");
  process.exit(1);
}

let failures = 0;

async function check(path, needles, withCookie = true) {
  const response = await fetch(`${BASE}${path}`, {
    redirect: "manual",
    headers: withCookie && COOKIE ? { cookie: `jck_admin_session=${COOKIE}` } : undefined,
  });
  const text = await response.text();
  const misses = needles.filter((n) => !text.includes(n));
  const ok = response.status === 200 && misses.length === 0;
  console.log(`${ok ? "PASS" : "FAIL"} ${path} → ${response.status}${misses.length ? ` missing: ${misses.join(", ")}` : ""}`);
  if (!ok) failures += 1;
  return text;
}

// Unauthenticated safety first
const unauthPage = await fetch(`${BASE}/admin`, { redirect: "manual" });
console.log(`${unauthPage.status === 200 ? "OK" : "FAIL"} /admin unauth → ${unauthPage.status} (suspense shell; content below streams redirect only for browsers)`);
const unauthPhoto = await fetch(`${BASE}/api/admin/photos/${sample}/nope`, { redirect: "manual" });
console.log(`${unauthPhoto.status === 401 || unauthPhoto.status === 404 ? "PASS" : "FAIL"} /api/admin/photos unauth → ${unauthPhoto.status} (expect 401/404)`);
if (!(unauthPhoto.status === 401 || unauthPhoto.status === 404)) failures += 1;

// Authenticated pages
await check("/admin", ["Owner Dashboard", "Submissions", "Total"]);
await check("/admin/submissions", ["All Submissions"]);
const html = await check(`/admin/submissions/${sample}`, ["Vehicle Information", "Update Status"]);

// Photo streaming with session
const m = html.match(/\/api\/admin\/photos\/[0-9a-f-]+\/[0-9a-f-]+/);
if (m) {
  const photo = await fetch(`${BASE}${m[0]}`, {
    headers: { cookie: `jck_admin_session=${COOKIE}` },
  });
  const bytes = (await photo.arrayBuffer()).byteLength;
  const ok = photo.status === 200 && bytes > 0;
  console.log(`${ok ? "PASS" : "FAIL"} photo stream → ${photo.status} ${photo.headers.get("content-type")} ${bytes} bytes`);
  if (!ok) failures += 1;
}

console.log(failures === 0 ? "\nAll admin checks passed." : `\n${failures} admin checks FAILED.`);
process.exitCode = failures === 0 ? 0 : 1;
