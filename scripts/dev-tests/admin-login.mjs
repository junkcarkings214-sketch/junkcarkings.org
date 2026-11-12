/**
 * Dev utility: logs in against /api/admin/auth/login and prints the session
 * cookie value for use with admin-e2e.mjs. Requires ADMIN_PASSWORD env var
 * (or pass it as the first argument).
 *   node scripts/dev-tests/admin-login.mjs "OwnerTest123!"
 */
const BASE = process.env.BASE ?? "http://localhost:3000";
const password = process.argv[2] ?? process.env.ADMIN_PASSWORD;

if (!password) {
  console.error("Usage: node scripts/dev-tests/admin-login.mjs <password>");
  process.exit(1);
}

const response = await fetch(`${BASE}/api/admin/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ password }),
});

if (!response.ok) {
  console.error(`Login failed → ${response.status}`);
  process.exit(1);
}

const setCookie = response.headers.get("set-cookie") ?? "";
const value = setCookie.match(/jck_admin_session=([^;]+)/)?.[1];
if (!value) {
  console.error("No session cookie in response.");
  process.exit(1);
}
console.log(value);
