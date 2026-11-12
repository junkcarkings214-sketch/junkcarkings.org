import nodemailer, { type Transporter } from "nodemailer";
import { buildSubmissionEmailHtml, buildSubmissionEmailText } from "./templates";
import type { PhotoToSave, VehicleSubmissionRecord } from "@/lib/storage";

/**
 * Lazily-created Nodemailer transport. Credentials only ever live in
 * environment variables and are read on the server side of this module —
 * this file must never be imported from client code.
 */
let cachedTransport: Transporter | null = null;

function createTransport(): Transporter | null {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT ?? 587);

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    // Avoid hanging an HTTP request for too long if SMTP is unreachable.
    connectionTimeout: 15_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
}

export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS,
  );
}

export interface OwnerNotificationResult {
  sent: boolean;
  error?: string;
}

/**
 * Notify the business owner about a new submission.
 * `photoData` supplies the raw image bytes used as email attachments.
 * Never throws — a notification failure must not lose the submission itself.
 */
export async function sendOwnerNotification(
  record: VehicleSubmissionRecord,
  photoData: PhotoToSave[],
): Promise<OwnerNotificationResult> {
  if (!isEmailConfigured()) {
    return { sent: false, error: "Email is not configured (SMTP env vars)" };
  }

  if (!cachedTransport) cachedTransport = createTransport();
  if (!cachedTransport) {
    return { sent: false, error: "Could not create mail transport" };
  }

  const submittedAt = new Date(record.createdAt);
  const vehicleLabel = `${record.vehicle.year} ${record.vehicle.make} ${record.vehicle.model}`;

  try {
    await cachedTransport.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.BUSINESS_EMAIL,
      replyTo: record.customer.email,
      subject: `New Vehicle Submission: ${vehicleLabel} — ${record.customer.fullName}`,
      text: buildSubmissionEmailText(record, submittedAt),
      html: buildSubmissionEmailHtml(record, submittedAt),
      // Cloudinary-hosted photos render inline in the email; only local-
      // fallback photos (no delivery URL) are attached as files.
      attachments: photoData
        .filter((p) => !p.meta.url)
        .map((p) => ({
          filename: p.meta.originalName,
          content: p.data,
          contentType: p.meta.mimeType,
        })),
    });
    return { sent: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[email] owner notification failed:", message);
    return { sent: false, error: message };
  }
}
