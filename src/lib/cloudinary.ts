import { v2 as cloudinary } from "cloudinary";

/**
 * Server-side Cloudinary upload helper for customer vehicle photos.
 *
 * Credentials come from the single `CLOUDINARY_URL` env var
 * (cloudinary://<api_key>:<api_secret>@<cloud_name>) and are read on the
 * server only — this module must never be imported from client code.
 *
 * Uploads go to the `vehicle-photos` folder; the returned URL is a signed-off
 * public delivery URL usable in the owner notification email.
 */

// Configure from CLOUDINARY_URL (true = parse the single env var).
cloudinary.config(true);

export interface CloudinaryPhotoResult {
  publicId: string;
  /** https delivery URL for the uploaded asset. */
  url: string;
  /** Bytes stored by Cloudinary. */
  size: number;
  /** Cloudinary-normalized format (jpg/png/webp...). */
  format: string;
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_URL ||
      (cloudinary.config().cloud_name &&
        cloudinary.config().api_key &&
        cloudinary.config().api_secret),
  );
}

/** Upload one photo buffer; resolves with delivery URL + public id. */
export function uploadPhotoToCloudinary(
  data: Buffer,
): Promise<CloudinaryPhotoResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "vehicle-photos",
        resource_type: "image",
        // Auto quality/format keeps deliveries small; the original remains
        // available via the same public id without transformations.
        transformation: [{ quality: "auto:good", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error || !result) {
          reject(
            new Error(
              error?.message ??
                "Cloudinary upload returned no result for an image.",
            ),
          );
          return;
        }
        resolve({
          publicId: result.public_id,
          url: result.secure_url ?? result.url,
          size: result.bytes,
          format: result.format,
        });
      },
    );
    stream.end(data);
  });
}
