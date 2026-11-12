import { z } from "zod";

/**
 * Shared vehicle submission validation.
 * Used by the client form (immediate feedback) and re-validated on the server
 * (never trust the client).
 */
export const vehicleConditionSchema = z.enum([
  "excellent",
  "very-good",
  "good",
  "fair",
  "poor",
]);

export const yesNoUnsureSchema = z.enum(["yes", "no", "unsure"]);

const nameField = z
  .string()
  .trim()
  .min(2, "Enter your full name")
  .max(80, "Name is too long")
  // letters, spaces, apostrophes, hyphens, periods — blocks stray symbols
  .regex(/^[a-zA-Z .'-]+$/, "Name can only contain letters, spaces, and . ' -");

const phoneField = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number")
  .max(20, "Phone number is too long")
  .regex(/^[0-9+()\-. ]+$/, "Phone number can only contain digits and ( ) + - .");

const zipField = z
  .string()
  .trim()
  .regex(/^\d{5}$/, "Enter a 5-digit ZIP code");

const optionalTextField = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${label} must be ${max} characters or fewer`)
    .optional()
    .or(z.literal("").transform(() => undefined));

export const vehicleSubmissionSchema = z.object({
  // Section 1 — Vehicle information
  year: z.coerce
    .number({ error: "Select a vehicle year" })
    .int()
    .min(1930, "Enter a valid vehicle year")
    // generous static ceiling keeps this schema prerender-safe; junk-vehicle
    // submissions years beyond this horizon are not a real concern
    .max(2100, "Enter a valid vehicle year"),
  make: z
    .string()
    .trim()
    .min(1, "Enter the vehicle make")
    .max(60, "Make is too long"),
  model: z
    .string()
    .trim()
    .min(1, "Enter the vehicle model")
    .max(60, "Model is too long"),
  trim: optionalTextField(60, "Trim"),
  vin: z
    .string()
    .trim()
    .toUpperCase()
    .regex(
      /^[A-HJ-NPR-Z0-9]{11,17}$/,
      "VIN must be 11–17 characters (no I, O, or Q)",
    )
    .optional()
    .or(z.literal("").transform(() => undefined)),
  mileage: z.coerce
    .number({ error: "Enter the mileage" })
    .int("Mileage must be a whole number")
    .min(0, "Mileage can't be negative")
    .max(2_000_000, "Mileage looks too high"),
  locationZip: zipField,

  // Section 2 — Vehicle condition
  condition: vehicleConditionSchema,
  starts: yesNoUnsureSchema,
  runs: yesNoUnsureSchema,
  titleStatus: z.enum(["clean", "lost", "salvage", "unsure"]),
  damaged: z.enum(["yes", "no"]),
  catalyticConverter: yesNoUnsureSchema,
  additionalInfo: optionalTextField(2000, "Additional vehicle information"),

  // Section 4 — Customer information
  fullName: nameField,
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address")
    .max(120, "Email is too long"),
  phone: phoneField,
  customerZip: zipField,
  customerMessage: optionalTextField(2000, "Message"),
});

export type VehicleSubmissionInput = z.infer<typeof vehicleSubmissionSchema>;

/** Server-side photo limits. Enforced again on the client for UX only. */
export const PHOTO_LIMITS = {
  maxCount: 8,
  /** Bytes */
  maxSize: 5 * 1024 * 1024,
  allowedMimeTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
  ] as const,
  allowedExtensions: ["jpg", "jpeg", "png", "webp"] as const,
} as const;
