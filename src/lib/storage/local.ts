import { promises as fs, type Dirent } from "node:fs";
import path from "node:path";
import type {
  PhotoToSave,
  StoredVehiclePhoto,
  SubmissionStatus,
  VehicleStorageProvider,
  VehicleSubmissionRecord,
} from "./types";

/** Validate an id so it can never be used for path traversal. */
function isSafeId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{1,64}$/.test(id);
}

function isSafeStoredFile(file: string): boolean {
  return /^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/i.test(file);
}

/**
 * Local-disk persistence: one directory per submission containing
 * `record.json` and a `photos/` folder.
 *
 * Storage layout (relative to `DATA_DIR`, default `<project>/.data`):
 *   submissions/<id>/record.json
 *   submissions/<id>/photos/<photoId>.<ext>
 */
export class LocalVehicleStorage implements VehicleStorageProvider {
  private readonly root: string;

  constructor(root?: string) {
    this.root =
      root ??
      process.env.DATA_DIR ??
      path.join(process.cwd(), ".data", "submissions");
  }

  private submissionDir(id: string): string {
    if (!isSafeId(id)) throw new Error("Invalid submission id");
    return path.join(this.root, id);
  }

  private photosDir(id: string): string {
    return path.join(this.submissionDir(id), "photos");
  }

  private recordPath(id: string): string {
    return path.join(this.submissionDir(id), "record.json");
  }

  private async atomicWriteJson(
    file: string,
    data: VehicleSubmissionRecord,
  ): Promise<void> {
    const tmp = `${file}.tmp-${Date.now()}`;
    await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
    await fs.rename(tmp, file);
  }

  async createSubmission(
    record: VehicleSubmissionRecord,
    photos: PhotoToSave[],
  ): Promise<VehicleSubmissionRecord> {
    // mkdir recursive also creates the submission + record parent directories.
    await fs.mkdir(this.photosDir(record.id), { recursive: true });

    for (const photo of photos) {
      // Cloudinary-hosted photos live in the CDN; only local-fallback photos
      // need bytes on disk.
      if (photo.meta.url) continue;
      if (!isSafeStoredFile(photo.meta.storedFile)) {
        throw new Error(`Unsafe photo file name: ${photo.meta.storedFile}`);
      }
      await fs.writeFile(
        path.join(this.photosDir(record.id), photo.meta.storedFile),
        photo.data,
      );
    }

    await this.atomicWriteJson(this.recordPath(record.id), record);
    return record;
  }

  async listSubmissions(): Promise<VehicleSubmissionRecord[]> {
    let entries: Dirent[];
    try {
      entries = await fs.readdir(this.root, { withFileTypes: true });
    } catch {
      return [];
    }

    const records = await Promise.all(
      entries
        .filter((e) => e.isDirectory() && isSafeId(e.name))
        .map(async (e) => {
          try {
            const raw = await fs.readFile(
              path.join(this.root, e.name, "record.json"),
              "utf8",
            );
            return JSON.parse(raw) as VehicleSubmissionRecord;
          } catch {
            return null;
          }
        }),
    );

    return records
      .filter((r): r is VehicleSubmissionRecord => r !== null)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async getSubmission(id: string): Promise<VehicleSubmissionRecord | null> {
    try {
      const raw = await fs.readFile(this.recordPath(id), "utf8");
      return JSON.parse(raw) as VehicleSubmissionRecord;
    } catch {
      return null;
    }
  }

  async updateSubmissionStatus(
    id: string,
    status: SubmissionStatus,
  ): Promise<VehicleSubmissionRecord | null> {
    const record = await this.getSubmission(id);
    if (!record) return null;
    const updated: VehicleSubmissionRecord = { ...record, status };
    await this.atomicWriteJson(this.recordPath(id), updated);
    return updated;
  }

  async setNotificationOutcome(
    id: string,
    outcome: {
      emailSent: boolean;
      emailError?: string | null;
    },
  ): Promise<VehicleSubmissionRecord | null> {
    const record = await this.getSubmission(id);
    if (!record) return null;
    const updated: VehicleSubmissionRecord = {
      ...record,
      notifications: { ...record.notifications, ...outcome },
    };
    await this.atomicWriteJson(this.recordPath(id), updated);
    return updated;
  }

  async readPhoto(
    submissionId: string,
    photoId: string,
  ): Promise<StoredVehiclePhoto | null> {
    if (!isSafeId(submissionId) || !isSafeId(photoId)) return null;

    const record = await this.getSubmission(submissionId);
    const meta = record?.photos.find((p) => p.id === photoId);
    if (!meta || !isSafeStoredFile(meta.storedFile)) return null;

    try {
      const buffer = await fs.readFile(
        path.join(this.photosDir(submissionId), meta.storedFile),
      );
      return {
        buffer,
        mimeType: meta.mimeType,
        filename: meta.storedFile,
      };
    } catch {
      return null;
    }
  }
}
