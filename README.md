# Junk Car Kings — junkcarking.org

A production-ready vehicle-buying website for **Junk Car Kings**: customers submit
their junk or unwanted vehicle online (with photos), the owner reviews every
submission in a password-protected dashboard, and contacts the customer with a
personal offer.

Built with **Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui ·
React Hook Form + Zod · Nodemailer · Lucide icons**.

---

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Copy `.env.example` to `.env.local` and fill in the values (see below).

```bash
pnpm build        # production build (TypeScript checks included)
pnpm start        # serve the production build
```

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | for email | Nodemailer transport for owner notifications |
| `SMTP_FROM` | for email | From: header, e.g. `Junk Car Kings <notify@yourdomain.com>` |
| `BUSINESS_EMAIL` | for email | Inbox that receives new submissions |
| `ADMIN_PASSWORD` | for dashboard | Owner dashboard password (min 8 chars; no default — dashboard is locked without it) |
| `ADMIN_SESSION_SECRET` | recommended | 32+ random chars; falls back to a hash of `ADMIN_PASSWORD` |
| `STORAGE_STRATEGY` | no | `local` (default) |
| `DATA_DIR` | no | Storage root override (default `<project>/.data`) |

Email is optional: without SMTP configured, submissions still save and appear in
the dashboard; the owner notification is skipped and the reason is logged.

### Verifying email delivery locally

Ethereal is a free fake SMTP that captures mail without sending it anywhere:

```bash
node scripts/dev-tests/make-ethereal-account.mjs .tmp/smtp.json
# put the credentials into .env.local, restart pnpm dev,
# then send a test submission and inspect the inbox:
node scripts/dev-tests/check-ethereal-inbox.mjs .tmp/smtp.json
```

---

## Website

| Route | Description |
|---|---|
| `/` | Hero, "get an offer" entry block, what we buy, how it works, why choose us, CTA, FAQ |
| `/sell-your-car` | 4-section submission form (vehicle info → condition → photos → customer info) |
| `/contact` | Phone, email, and service-area info |

### Submission form

- React Hook Form + Zod validation (identical schema re-validated server-side)
- Drag-and-drop multi-photo upload with previews, per-photo removal, real
  upload progress, and size/type validation (JPG/PNG/WEBP, ≤5 MB each, ≤8 photos)
- Success screen with reference ID; meaningful error messages; duplicate-submit guard
- Uploads travel via XHR (`src/components/forms/xhr.ts`) so progress is real

---

## Data, storage & email

- **Persistence:** none — submissions are not stored server-side. The owner
  email IS the record. This keeps the app serverless-safe (no filesystem
  writes in production).
- **Photos:** uploaded to Cloudinary (`CLOUDINARY_URL`); the delivery links are
  included in the owner email. Photos whose Cloudinary upload fails are
  attached to the email as files, so a CDN outage never loses a lead.
- **Email:** `src/lib/email/client.ts` (server-only Nodemailer transport) +
  `src/lib/email/templates.ts` (branded HTML/text template). A failed email
  send fails the request visibly (HTTP 500) rather than silently losing the
  lead.

## Security notes

- Server-side validation with Zod on every submission; client validation is UX only.
- Uploaded files are sniffed by magic bytes, restricted to
  `image/jpeg|png|webp`, size- and count-limited; names sanitized before storage.
- Public form is rate-limited to 8 submissions / 15 min per IP (in-memory).
- SMTP credentials never leave the server; no email code is client-imported.
- Error responses never expose internals; details go to server logs.

## Testing the full flow

```bash
# uses the publicly running server (default http://localhost:3000)
node scripts/dev-tests/submission-e2e.mjs
```

## Credits

- Hero photo: ["Utah – North America – Cars – Junk Yard"](https://commons.wikimedia.org/wiki/File:Utah_-_North_America_-_Cars_-_Junk_Yard_(4892031589).jpg)
  by **CGP Grey**, CC BY 2.0 (changes were cropping/compression only).
