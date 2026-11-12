/**
 * Dev utility: end-to-end test of POST /api/vehicle-submissions.
 * Run with the server running (default http://localhost:3000):
 *   node scripts/dev-tests/submission-e2e.mjs
 */

const BASE = process.env.BASE ?? "http://localhost:3000";

// Smallest valid 2x2 PNG (transparent) — passes magic-byte sniffing.
const PNG_BYTES = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAACZgbYnAAAAEElEQVR4nGP8z8Dwn4GKgA0AKogDzRauTyAAAAAASUVORK5CYII=",
  "base64",
);

// A text file masquerading as .png — must be rejected by magic-byte sniffing.
const FAKE_FILE = Buffer.from("not an image at all\n", "utf8");

const png1 = new File([PNG_BYTES], "front.png", { type: "image/png" });
const png2 = new File([PNG_BYTES], "side.png", { type: "image/png" });
const fake = new File([FAKE_FILE], "fake.png", { type: "image/png" });

const payload = {
  year: "2012",
  make: "Ford",
  model: "F-150",
  trim: "XLT",
  vin: "1FTFW1ET5CFD12345",
  mileage: "187000",
  locationZip: "76543",
  condition: "fair",
  starts: "yes",
  runs: "no",
  titleStatus: "clean",
  damaged: "yes",
  additionalInfo: "Front bumper damage, bed rust.",
  fullName: "Sam Parker",
  email: "sam.parker@example.com",
  phone: "(254) 400-1234",
  customerZip: "76543",
  customerMessage: "Available most evenings.",
};

async function post(name, { payloadOverride, photos }, expectStatus) {
  const form = new FormData();
  form.append("payload", JSON.stringify({ ...payload, ...payloadOverride }));
  for (const [file, name_] of photos) form.append("photos", file, name_);

  const response = await fetch(`${BASE}/api/vehicle-submissions`, {
    method: "POST",
    body: form,
  });
  const body = await response.json().catch(() => ({}));
  const ok =
    response.status === expectStatus &&
    (expectStatus < 300 ? body.ok === true : body.ok === false);
  console.log(
    `${ok ? "PASS" : "FAIL"} ${name} → ${response.status} ${JSON.stringify(body).slice(0, 140)}`,
  );
  return ok;
}

let failures = 0;
const check = (name, args, status) => post(name, args, status);

for (const [name, args, status] of [
  [
    "happy-path-with-2-photos",
    { photos: [[png1, "front.png"], [png2, "side.png"]] },
    201,
  ],
  [
    "missing-condition",
    { payloadOverride: { condition: "" }, photos: [] },
    400,
  ],
  [
    "bad-email",
    { payloadOverride: { email: "not-an-email" }, photos: [] },
    400,
  ],
  [
    "fake-image-rejected",
    { photos: [[fake, "fake.png"]] },
    400,
  ],
]) {
  if (!check(name, args, status)) failures += 1;
}

// Non-multipart body must be rejected cleanly.
const r = await fetch(`${BASE}/api/vehicle-submissions`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
console.log(`${r.status === 400 ? "PASS" : "FAIL"} json-body-rejected → ${r.status} (expect 400)`);
if (r.status !== 400) failures += 1;

console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} checks FAILED.`);
process.exitCode = failures === 0 ? 0 : 1;
