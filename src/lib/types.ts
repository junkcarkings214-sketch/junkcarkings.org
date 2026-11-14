import type { VehicleSubmissionInput } from "@/lib/validation/vehicle-submission";

export interface VehiclePhotoMeta {
  /** Stable photo id (safe for URL use). */
  id: string;
  /** File name as attached to the email (used only when Cloudinary is unavailable). */
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
}

/** Lob a photo (bytes) + its metadata into the email pipeline. */
export interface PhotoToSave {
  meta: VehiclePhotoMeta;
  data: Buffer;
}
