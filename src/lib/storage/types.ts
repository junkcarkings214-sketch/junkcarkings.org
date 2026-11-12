import type { VehicleSubmissionInput } from "@/lib/validation/vehicle-submission";

export type SubmissionStatus = "new" | "contacted" | "offered" | "closed";

export interface VehiclePhotoMeta {
  /** Stable photo id (safe for URL use). */
  id: string;
  /** File name as stored on disk (legacy local storage; absent for Cloudinary). */
  storedFile: string;
  /** Original name provided by the customer. */
  originalName: string;
  mimeType: string;
  size: number;
  /** Cloudinary-hosted delivery URL (present when the photo lives in Cloudinary). */
  url?: string;
  /** Cloudinary public id, needed if the photo is ever deleted from the CDN. */
  publicId?: string;
}

export interface VehicleSubmissionRecord {
  id: string;
  createdAt: string;
  status: SubmissionStatus;
  vehicle: {
    year: number;
    make: string;
    model: string;
    trim?: string;
    vin?: string;
    mileage: number;
    locationZip: string;
  };
  condition: {
    condition: VehicleSubmissionInput["condition"];
    starts: VehicleSubmissionInput["starts"];
    runs: VehicleSubmissionInput["runs"];
    titleStatus: VehicleSubmissionInput["titleStatus"];
    damaged: "yes" | "no";
    catalyticConverter: "yes" | "no" | "unsure";
    additionalInfo?: string;
  };
  customer: {
    fullName: string;
    email: string;
    phone: string;
    zip: string;
    message?: string;
  };
  photos: VehiclePhotoMeta[];
  notifications: {
    emailSent: boolean;
    emailError?: string | null;
  };
}

export interface StoredVehiclePhoto {
  buffer: Buffer;
  mimeType: string;
  filename: string;
}

/** Lob a photo (bytes) + its metadata into the store. */
export interface PhotoToSave {
  meta: VehiclePhotoMeta;
  data: Buffer;
}

/**
 * Persistence abstraction for vehicle submissions.
 *
 * The built-in provider persists to local disk (`.data/`). This is suitable for
 * evaluation and self-hosted single-server deployments — see
 * `docs/persistence.md` for the recommended production swap to Supabase
 * (database + storage bucket), which only requires implementing this interface.
 */
export interface VehicleStorageProvider {
  createSubmission(
    record: VehicleSubmissionRecord,
    photos: PhotoToSave[],
  ): Promise<VehicleSubmissionRecord>;
  listSubmissions(): Promise<VehicleSubmissionRecord[]>;
  getSubmission(id: string): Promise<VehicleSubmissionRecord | null>;
  updateSubmissionStatus(
    id: string,
    status: SubmissionStatus,
  ): Promise<VehicleSubmissionRecord | null>;
  setNotificationOutcome(
    id: string,
    outcome: {
      emailSent: boolean;
      emailError?: string | null;
    },
  ): Promise<VehicleSubmissionRecord | null>;
  readPhoto(
    submissionId: string,
    photoId: string,
  ): Promise<StoredVehiclePhoto | null>;
}
