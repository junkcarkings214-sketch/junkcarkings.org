import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { vehicleSubmissionSchema, PHOTO_LIMITS } from "@/lib/validation/vehicle-submission";
import type { PhotoToSave, VehiclePhotoMeta } from "@/lib/types";
import { createVehicleSubmission } from "@/lib/submissions";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  isCloudinaryConfigured,
  uploadPhotoToCloudinary,
} from "@/lib/cloudinary";

/** Verify a buffer really is a JPEG/PNG/WEBP before trusting the declared MIME type. */
function sniffImageType(data: Buffer): string | null {
  if (data.length < 12) return null;
  // JPEG: FF D8 FF
  if (data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) return "image/jpeg";
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4e &&
    data[3] === 0x47 && data[4] === 0x0d && data[5] === 0x0a &&
    data[6] === 0x1a && data[7] === 0x0a
  ) {
    return "image/png";
  }
  // WEBP: RIFF .... WEBP
  if (
    data.toString("ascii", 0, 4) === "RIFF" &&
    data.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  return null;
}

/** Strip anything path- or HTML-unsafe from an original file name. */
function sanitizeOriginalName(name: string): string {
  const base = path.basename(name).slice(0, 60);
  return base.replace(/[^\w.\- ]+/g, "_").trim() || "photo";
}

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const gate = checkRateLimit(`post:${ip}`);
  if (!gate.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please try again later." },
      { status: 429, headers: { "Retry-After": String(gate.retryAfterSec) } },
    );
  }

  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.startsWith("multipart/form-data")) {
    return NextResponse.json(
      { ok: false, error: "Expected multipart form data." },
      { status: 400 },
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid form data." },
      { status: 400 },
    );
  }

  // ---- Parse + validate structured fields (server-side, never the client's word) ----
  const rawPayload = formData.get("payload");
  if (typeof rawPayload !== "string") {
    return NextResponse.json(
      { ok: false, error: "Missing submission payload." },
      { status: 400 },
    );
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawPayload);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid submission payload." },
      { status: 400 },
    );
  }

  const parsed = vehicleSubmissionSchema.safeParse(parsedJson);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the highlighted fields and try again." },
      { status: 400 },
    );
  }

  // ---- Collect + validate photos (at least one is required) ----
  const files = formData
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Please add at least one photo of your vehicle." },
      { status: 400 },
    );
  }

  if (files.length > PHOTO_LIMITS.maxCount) {
    return NextResponse.json(
      { ok: false, error: `A maximum of ${PHOTO_LIMITS.maxCount} photos is allowed.` },
      { status: 400 },
    );
  }

  {
    // A shared size guard for the entire upload as well as each file.
    const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
    const maxTotal = PHOTO_LIMITS.maxSize * PHOTO_LIMITS.maxCount;
    if (totalBytes > maxTotal) {
      return NextResponse.json(
        { ok: false, error: "Uploaded photos are too large." },
        { status: 400 },
      );
    }
  }

  const photoData: PhotoToSave[] = [];
  for (const file of files) {
    if (file.size > PHOTO_LIMITS.maxSize) {
      return NextResponse.json(
        { ok: false, error: `"${sanitizeOriginalName(file.name)}" exceeds the 5 MB limit.` },
        { status: 400 },
      );
    }
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (
      !PHOTO_LIMITS.allowedMimeTypes.includes(file.type as (typeof PHOTO_LIMITS.allowedMimeTypes)[number]) ||
      !PHOTO_LIMITS.allowedExtensions.includes(ext as (typeof PHOTO_LIMITS.allowedExtensions)[number])
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Only JPG, PNG, and WEBP images are supported.",
        },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const sniffed = sniffImageType(buffer);
    if (!sniffed || sniffed !== file.type) {
      return NextResponse.json(
        { ok: false, error: "One of the images isn't a valid supported image file." },
        { status: 400 },
      );
    }

    const id = randomUUID();
    const meta: VehiclePhotoMeta = {
      id,
      storedFile: `${id}.${ext === "jpeg" ? "jpg" : ext}`,
      originalName: sanitizeOriginalName(file.name),
      mimeType: sniffed,
      size: buffer.byteLength,
    };

    // Prefer Cloudinary hosting; if it fails or is unconfigured, the photo
    // bytes are attached to the owner email instead so a CDN outage never
    // loses the lead.
    if (isCloudinaryConfigured()) {
      try {
        const uploaded = await uploadPhotoToCloudinary(buffer);
        meta.url = uploaded.url;
        meta.publicId = uploaded.publicId;
        meta.size = uploaded.size;
        meta.mimeType = uploaded.format === "jpg" ? "image/jpeg" : sniffed;
      } catch (uploadError) {
        console.error(
          "[photos] Cloudinary upload failed, attaching to email instead:",
          uploadError instanceof Error ? uploadError.message : uploadError,
        );
      }
    }

    photoData.push({ meta, data: buffer });
  }

  // ---- Persist + notify (never surfaces storage internals to the client) ----
  try {
    const record = await createVehicleSubmission(parsed.data, photoData);
    return NextResponse.json(
      { ok: true, reference: record.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("[vehicle-submissions] failed:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Something went wrong while submitting your vehicle. Please try again, or call us.",
      },
      { status: 500 },
    );
  }
}
