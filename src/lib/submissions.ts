import { randomUUID } from "node:crypto";
import { storage } from "@/lib/storage";
import type {
  PhotoToSave,
  SubmissionStatus,
  VehiclePhotoMeta,
  VehicleSubmissionRecord,
} from "@/lib/storage";
import { sendOwnerNotification } from "@/lib/email/client";
import type { VehicleSubmissionInput } from "@/lib/validation/vehicle-submission";

export type { SubmissionStatus };

export const SUBMISSION_STATUSES: SubmissionStatus[] = [
  "new",
  "contacted",
  "offered",
  "closed",
];

export const STATUS_LABELS: Record<SubmissionStatus, string> = {
  new: "New",
  contacted: "Contacted",
  offered: "Offer sent",
  closed: "Closed",
};

export async function createVehicleSubmission(
  input: VehicleSubmissionInput,
  photoData: PhotoToSave[],
): Promise<VehicleSubmissionRecord> {
  const record: VehicleSubmissionRecord = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: "new",
    vehicle: {
      year: input.year,
      make: input.make,
      model: input.model,
      trim: input.trim,
      vin: input.vin,
      mileage: input.mileage,
      locationZip: input.locationZip,
    },
    condition: {
      condition: input.condition,
      starts: input.starts,
      runs: input.runs,
      titleStatus: input.titleStatus,
      damaged: input.damaged,
      catalyticConverter: input.catalyticConverter,
      additionalInfo: input.additionalInfo,
    },
    customer: {
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      zip: input.customerZip,
      message: input.customerMessage,
    },
    // Overwrite original file names inside the record with a sanitized,
    // attachment-only version of the metadata.
    photos: [] as VehiclePhotoMeta[],
    notifications: { emailSent: false },
  };

  // Persist first — email delivery must never decide whether a lead is kept.
  const saved = await storage.createSubmission(
    {
      ...record,
      photos: photoData.map((p) => p.meta),
    },
    photoData,
  );

  const notification = await sendOwnerNotification(
    {
      ...saved,
      photos: photoData.map((p) => p.meta),
    },
    photoData,
  );

  // Record whether the owner email actually went out, so the admin dashboard
  // can flag submissions whose notification failed.
  const recorded = await storage.setNotificationOutcome(saved.id, {
    emailSent: notification.sent,
    emailError: notification.error ?? null,
  });

  if (!notification.sent) {
    console.warn(
      `[submissions] owner notification not sent for ${saved.id}: ${notification.error}`,
    );
  }

  return recorded ?? saved;
}

export async function listVehicleSubmissions(): Promise<
  VehicleSubmissionRecord[]
> {
  return storage.listSubmissions();
}

export async function getVehicleSubmission(
  id: string,
): Promise<VehicleSubmissionRecord | null> {
  return storage.getSubmission(id);
}

export async function setSubmissionStatus(
  id: string,
  status: SubmissionStatus,
): Promise<VehicleSubmissionRecord | null> {
  return storage.updateSubmissionStatus(id, status);
}
