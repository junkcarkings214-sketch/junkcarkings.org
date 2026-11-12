# Persistence & Storage

## Current strategy (local disk)

Submissions and customer-uploaded photos are persisted through the
`VehicleStorageProvider` interface in `src/lib/storage/`:

```
src/lib/storage/
├── types.ts    # provider interface + record types
├── local.ts    # LocalVehicleStorage (default)
└── index.ts    # provider factory (STORAGE_STRATEGY env var)
```

Layout on disk (relative to `DATA_DIR`, default `<project root>/.data`):

```
.data/
└── submissions/
    └── <submission-uuid>/
        ├── record.json        # full submission record (id, status, vehicle, customer, photos)
        └── photos/            # <photoId>.jpg / .png / .webp
```

Notes:

- Data lives **outside `public/`** — photos are never served as static files.
  The admin dashboard streams them through the authenticated route
  `GET /api/admin/photos/[subId]/[photoId]`, which checks the admin session
  cookie first.
- This works for local development and self-hosted single-node deployments.
  It is **not** durable across serverless platforms (Vercel, etc.), since the
  filesystem is ephemeral.

## Recommended production setup: Supabase

When the business is ready for a managed, durable solution, implement the
provider against Supabase Postgres + Storage. Nothing else in the app needs
to change — the interface is the only contract.

### 1. Table — `vehicle_submissions`

```sql
create table vehicle_submissions (
  id uuid primary key,
  created_at timestamptz not null default now(),
  status text not null default 'new',        -- new | contacted | offered | closed

  -- vehicle
  vehicle_year smallint not null,
  vehicle_make text not null,
  vehicle_model text not null,
  vehicle_trim text,
  vehicle_vin text,
  vehicle_mileage integer not null,
  vehicle_zip text not null,

  -- condition
  condition text not null,
  starts text not null,                       -- yes | no | unsure
  runs text not null,                         -- yes | no | unsure
  title_status text not null,                 -- clean | lost | salvage | unsure
  damaged text not null,                      -- yes | no
  additional_info text,

  -- customer
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_zip text not null,
  customer_message text,

  -- denormalized for quick listing
  photos jsonb not null default '[]'
);

create index idx_submissions_created_at on vehicle_submissions (created_at desc);
create index idx_submissions_status on vehicle_submissions (status);
```

Row Level Security should be enabled with **no anon policies** — the dashboard
accesses the table with the service role (or a Supabase-authenticated owner),
never with the public key.

### 2. Storage bucket — `vehicle-photos`

- Path pattern: `<submissionId>/<photoId>.<ext>` (same layout as local.ts).
- Bucket should be private. Admin-only read goes through the same
  authenticated photo route (which can fetch from the bucket server-side), or
  via signed URLs minted server-side after the admin session is verified.

### 3. Provider implementation

```ts
// src/lib/storage/supabase.ts
export class SupabaseVehicleStorage implements VehicleStorageProvider {
  createSubmission(record, photos) { /* insert row + upload photo objects */ }
  listSubmissions() { /* select, order by created_at desc */ }
  getSubmission(id) { /* select by id */ }
  updateSubmissionStatus(id, status) { /* update, returning * */ }
  readPhoto(submissionId, photoId) { /* download object */ }
}
```

Then register it in `src/lib/storage/index.ts`:

```ts
if (strategy === "supabase") return new SupabaseVehicleStorage();
```

### 4. Cleanup for the email flow

`createVehicleSubmission` (`src/lib/submissions.ts`) already passes photo
buffers to both the storage provider and the email sender — a Supabase
provider just needs to persist `PhotoToSave` entries it receives.

## Environment variables

Set on the server only (never exposed to the browser):

| Variable | Purpose |
|---|---|
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Nodemailer transport |
| `SMTP_FROM` | From: address for notifications |
| `BUSINESS_EMAIL` | Inbox that receives submissions |
| `ADMIN_PASSWORD` | Dashboard password (no default; dashboard is locked without it) |
| `ADMIN_SESSION_SECRET` | Session cookie signing secret (optional, recommended) |
| `STORAGE_STRATEGY` | `local` (default) |
| `DATA_DIR` | Local storage root override |
