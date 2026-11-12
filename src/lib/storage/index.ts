import { LocalVehicleStorage } from "./local";
import type { VehicleStorageProvider } from "./types";

/**
 * Storage provider factory.
 *
 * - `local` (default): files under `.data/` — works for development and
 *   self-hosted single-node deployments.
 *
 * When the business is ready for managed persistence (multi-region deploys,
 * backups, etc.), implement `VehicleStorageProvider` with Supabase
 * (`vehicle_submissions` table + `vehicle-photos` storage bucket) and register
 * it here. See `docs/persistence.md` for the planned schema and swap guide.
 */
function createStorage(): VehicleStorageProvider {
  const strategy = (process.env.STORAGE_STRATEGY ?? "local").toLowerCase();
  if (strategy !== "local") {
    throw new Error(
      `Unknown STORAGE_STRATEGY "${strategy}". Supported: "local"`,
    );
  }
  return new LocalVehicleStorage();
}

export const storage = createStorage();

export type {
  PhotoToSave,
  StoredVehiclePhoto,
  SubmissionStatus,
  VehiclePhotoMeta,
  VehicleStorageProvider,
  VehicleSubmissionRecord,
} from "./types";
