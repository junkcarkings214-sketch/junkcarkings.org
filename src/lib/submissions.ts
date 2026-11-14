import { randomUUID } from "node:crypto";
import type { PhotoToSave, VehicleSubmissionRecord } from "@/lib/types";
import { sendOwnerNotification } from "@/lib/email/client";
import type { VehicleSubmissionInput } from "@/lib/validation/vehicle-submission";

/**
 * Build the submission record and email it to the business owner.
 *
 * There is no server-side persistence: the owner email IS the record. All
 * Cloudinary-hosted photos are included as delivery links; photos that
 * failed CDN upload are attached as files so a lead is never lost.
 *
 * Throws when the owner email cannot be sent, so the API route can fail the
 * request visibly instead of silently dropping the lead.
 */
export async function createVehicleSubmission(
  input: VehicleSubmissionInput,
  photoData: PhotoToSave[],
): Promise<VehicleSubmissionRecord> {
  const record: VehicleSubmissionRecord = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
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
    photos: photoData.map((p) => p.meta),
  };

  const notification = await sendOwnerNotification(record, photoData);

  if (!notification.sent) {
    console.error(
      `[submissions] owner notification failed for ${record.id}: ${notification.error}`,
    );
    throw new Error(
      notification.error ?? "Owner notification could not be sent",
    );
  }

  return record;
}
