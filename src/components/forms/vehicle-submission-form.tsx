"use client";






import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, CheckCircle2, Loader2, RotateCcw, ShieldCheck } from "lucide-react";import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type ControllerRenderProps, type Resolver } from "react-hook-form";
import {
  vehicleSubmissionSchema,
  type VehicleSubmissionInput,
} from "@/lib/validation/vehicle-submission";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "cn";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  PhotoUploader,
  type UploadedPhoto,
} from "./photo-uploader";
import { submitVehicleSubmission } from "./xhr";

/**
 * HTML-friendly representation of the form values (all plain strings /
 * option values). The zod schema re-parses these (z.coerce handles
 * "1999" → 1999), so resolver validation still runs on the real schema.
 */
type FormValues = {
  year: string;
  make: string;
  model: string;
  trim: string;
  vin: string;
  mileage: string;
  locationZip: string;
  condition: VehicleSubmissionInput["condition"] | "";
  starts: VehicleSubmissionInput["starts"] | "";
  runs: VehicleSubmissionInput["runs"] | "";
  titleStatus: VehicleSubmissionInput["titleStatus"] | "";
  damaged: VehicleSubmissionInput["damaged"] | "";
  catalyticConverter: VehicleSubmissionInput["catalyticConverter"] | "";
  additionalInfo: string;
  fullName: string;
  email: string;
  phone: string;
  customerZip: string;
  customerMessage: string;
};

type Field = ControllerRenderProps<FormValues>;
type VehicleFormResolver = Resolver<FormValues, unknown, VehicleSubmissionInput>;

const INITIAL_VALUES: FormValues = {
  year: "",
  make: "",
  model: "",
  trim: "",
  vin: "",
  mileage: "",
  locationZip: "",
  condition: "",
  starts: "",
  runs: "",
  titleStatus: "",
  damaged: "",
  catalyticConverter: "",
  additionalInfo: "",
  fullName: "",
  email: "",
  phone: "",
  customerZip: "",
  customerMessage: "",
};

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------

const BASE_YEAR_CEILING = 2027; // prerender-stable default; refreshed after mount

function buildYearOptions(ceiling: number): number[] {
  const years: number[] = [];
  for (let y = ceiling; y >= 1940; y--) years.push(y);
  return years;
}

const CONDITION_OPTIONS = [
  { value: "excellent", label: "Excellent — near perfect" },
  { value: "very-good", label: "Very good — minor issues" },
  { value: "good", label: "Good — normal wear" },
  { value: "fair", label: "Fair — noticeable problems" },
  { value: "poor", label: "Poor — significant damage" },
] as const;

const YES_NO_UNSURE_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Not sure" },
] as const;

const TITLE_OPTIONS = [
  { value: "clean", label: "Yes — clean title" },
  { value: "salvage", label: "Yes — salvage title" },
  { value: "lost", label: "No — lost or missing" },
  { value: "unsure", label: "Not sure" },
] as const;

const YES_NO_OPTIONS = [
  { value: "no", label: "No" },
  { value: "yes", label: "Yes" },
] as const;

// ---------------------------------------------------------------------------
// Reusable controls
// ---------------------------------------------------------------------------

function RadioPick({
  field,
  options,
  fieldId,
}: {
  field: Field;
  options: ReadonlyArray<{ value: string; label: string }>;
  fieldId: string;
}) {
  return (
    <RadioGroup
      value={field.value ?? ""}
      onValueChange={field.onChange}
      onBlur={field.onBlur}
      className="flex flex-wrap gap-2"
    >
      {options.map((option) => {
        const id = `${fieldId}-${option.value}`;
        const selected = field.value === option.value;
        return (
          <Label
            key={option.value}
            htmlFor={id}
            className={cn(
              "relative flex h-12 cursor-pointer items-center gap-2.5 rounded-lg border border-line bg-paper px-4 text-[15px] font-medium text-ink-soft transition-colors hover:border-ink/30 hover:text-ink",
              "focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-ink",
              selected && "border-ink bg-sand font-semibold text-ink",
            )}
          >
            <RadioGroupItem
              value={option.value}
              id={id}
              className="absolute inset-0 size-0! cursor-pointer border-0! p-0! opacity-0"
            />
            {selected && <Check className="size-3.5 shrink-0 text-gold-strong" aria-hidden />}
            <span>{option.label}</span>
          </Label>
        );
      })}
    </RadioGroup>
  );
}

function SectionHeader({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-mist text-sm font-bold text-ink">
        {step}
      </span>
      <div>
        <h2 className="text-xl leading-tight font-bold text-ink">{title}</h2>
        <p className="mt-1.5 max-w-[56ch] text-[14px] leading-relaxed text-ink-soft">
          {description}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// The form
// ---------------------------------------------------------------------------

export function VehicleSubmissionForm() {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  // Refresh the year ceiling when the year picker opens (event-based update —
  // no effect needed), so the prerendered shell stays stable.
  const [yearCeiling, setYearCeiling] = useState(BASE_YEAR_CEILING);
  const yearOptions = useMemo(() => buildYearOptions(yearCeiling), [yearCeiling]);

  const form = useForm<FormValues, unknown, VehicleSubmissionInput>({
    resolver: zodResolver(vehicleSubmissionSchema) as VehicleFormResolver,
    defaultValues: INITIAL_VALUES,
    mode: "onTouched",
  });

  const submitting = form.formState.isSubmitting;

  /**
   * The home notice collects year/make/model before sending the visitor here.
   * Read them once on mount so nobody types the same vehicle twice.
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawYear = (params.get("year") ?? "").trim();
    const make = (params.get("make") ?? "").trim();
    const model = (params.get("model") ?? "").trim();

    if (/^\d{4}$/.test(rawYear) && yearOptions.includes(Number(rawYear))) {
      form.setValue("year", rawYear);
    }
    if (make) form.setValue("make", make.slice(0, 40));
    if (model) form.setValue("model", model.slice(0, 60));
    // Mount only: anything typed afterwards belongs to the visitor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(values: VehicleSubmissionInput) {
    setServerError(null);
    setUploadProgress(0);
    const result = await submitVehicleSubmission(
      values,
      photos.map((p) => p.file),
      setUploadProgress,
    );

    if (result.kind === "success") {
      setReference(result.reference ?? null);
    } else {
      setServerError(result.message);
    }
  }

  if (reference !== null) {
    return (
      <div>
        <span className="flex size-12 items-center justify-center rounded-full bg-mist text-ink">
          <CheckCircle2 className="size-6" aria-hidden />
        </span>
        <h2 className="mt-5 text-[clamp(1.75rem,5vw,2.5rem)] leading-[1.05] font-extrabold text-ink">
          Thanks — your vehicle is in.
        </h2>
        <p className="mt-3 max-w-[50ch] text-[15.5px] leading-relaxed text-ink-soft">
          A person here reads every notice personally and will contact you at the
          email or phone number you left with an offer. No obligation to accept.
        </p>

        {reference && (
          <p className="mt-5 inline-block rounded-lg bg-mist px-3.5 py-2 text-[13px] text-ink-soft">
            Reference{" "}
            <span className="font-semibold text-ink tabular-nums">{reference}</span>
          </p>
        )}

        <ul className="mt-7 max-w-[52ch] space-y-3 border-t border-line pt-5 text-[14.5px] text-ink-soft">
          <li className="flex gap-2.5">
            <Check className="mt-0.5 size-4 shrink-0 text-gold-strong" aria-hidden />
            We review your vehicle details and photos.
          </li>
          <li className="flex gap-2.5">
            <Check className="mt-0.5 size-4 shrink-0 text-gold-strong" aria-hidden />
            We reach out with your offer — no obligation to accept.
          </li>
          <li className="flex gap-2.5">
            <Check className="mt-0.5 size-4 shrink-0 text-gold-strong" aria-hidden />
            Questions? Reply to any message we send, or call us anytime.
          </li>
        </ul>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">Back to home</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              form.reset(INITIAL_VALUES);
              setPhotos([]);
              setReference(null);
              setUploadProgress(0);
            }}
          >
            <RotateCcw className="size-4" aria-hidden />
            Submit another vehicle
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="vehicle-form flex flex-col gap-8"
      >
        {serverError && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            <p className="font-semibold">We couldn&apos;t submit your vehicle.</p>
            <p className="mt-0.5">{serverError}</p>
          </div>
        )}

        {/* ------------------------- Section 1: Vehicle information ------------------------- */}
        <section className="border-t border-line pt-8 first:border-t-0 first:pt-0">
          <SectionHeader step={1}
            title="Vehicle Information"
            description="The basics about the vehicle you'd like to sell."
          />
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="year"
              render={({ field }: { field: Field }) => (
                <FormItem>
                  <FormLabel>Vehicle Year *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    onOpenChange={(open) => {
                      if (open) setYearCeiling(new Date().getFullYear() + 1);
                    }}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-64">
                      {yearOptions.map((year) => (
                        <SelectItem key={year} value={String(year)}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mileage"
              render={({ field }: { field: Field }) => (
                <FormItem>
                  <FormLabel>Mileage *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      placeholder="e.g. 180000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="make"
              render={({ field }: { field: Field }) => (
                <FormItem>
                  <FormLabel>Vehicle Make *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Ford" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }: { field: Field }) => (
                <FormItem>
                  <FormLabel>Vehicle Model *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. F-150" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trim"
              render={({ field }: { field: Field }) => (
                <FormItem>
                  <FormLabel>Trim (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. XLT SuperCrew" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vin"
              render={({ field }: { field: Field }) => (
                <FormItem>
                  <FormLabel>VIN (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="17-character VIN"
                      className="font-mono uppercase"
                      inputMode="text"
                      maxLength={17}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>Found on the dash plate, door jamb, or title.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="locationZip"
              render={({ field }: { field: Field }) => (
                <FormItem>
                  <FormLabel>Vehicle Location (ZIP) *</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      placeholder="5-digit ZIP code"
                      autoComplete="postal-code"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Where the vehicle is parked right now.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* ------------------------- Section 2: Vehicle condition ------------------------- */}
        <section className="border-t border-line pt-8">
          <SectionHeader step={2}
            title="Vehicle Condition"
            description="Honesty here helps us make an accurate, fair offer the first time."
          />
          <div className="mt-6 flex flex-col gap-5">
            <FormField
              control={form.control}
              name="condition"
              render={({ field }: { field: Field }) => (
                <FormItem>
                  <FormLabel>Overall Vehicle Condition *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="How would you rate it overall?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CONDITION_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="starts"
              render={({ field }: { field: Field }) => (
                <FormItem>
                  <FormLabel>Does the vehicle start? *</FormLabel>
                  <FormControl>
                    <RadioPick field={field} options={YES_NO_UNSURE_OPTIONS} fieldId="starts" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="runs"
              render={({ field }: { field: Field }) => (
                <FormItem>
                  <FormLabel>Does it run and drive? *</FormLabel>
                  <FormControl>
                    <RadioPick field={field} options={YES_NO_UNSURE_OPTIONS} fieldId="runs" />
                  </FormControl>
                  <FormDescription>
                    Can it move under its own power?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="titleStatus"
              render={({ field }: { field: Field }) => (
                <FormItem>
                  <FormLabel>Is the title available? *</FormLabel>
                  <FormControl>
                    <RadioPick field={field} options={TITLE_OPTIONS} fieldId="title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="damaged"
              render={({ field }: { field: Field }) => (
                <FormItem>
                  <FormLabel>Is the vehicle damaged? *</FormLabel>
                  <FormControl>
                    <RadioPick field={field} options={YES_NO_OPTIONS} fieldId="damaged" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="catalyticConverter"
              render={({ field }: { field: Field }) => (
                <FormItem>
                  <FormLabel>Does the vehicle have a missing or replaced catalytic converter? *</FormLabel>
                  <FormControl>
                    <RadioPick field={field} options={YES_NO_UNSURE_OPTIONS} fieldId="catalytic" />
                  </FormControl>
                  <FormDescription>
                    Catalytic converters carry real value - tell us if it is gone or already swapped.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }: { field: Field }) => (
                <FormItem>
                  <FormLabel>Additional Vehicle Information</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Anything else we should know — missing parts, recent work, warning lights, location quirks…"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* ------------------------- Section 3: Vehicle photos ------------------------- */}
        <section className="border-t border-line pt-8">
          <SectionHeader step={3}
            title="Vehicle Photos"
            description="Not required, but clear photos help us make a stronger offer faster."
          />
          <div className="mt-6">
            <PhotoUploader value={photos} onChange={setPhotos} disabled={submitting} />
          </div>
        </section>

        {/* ------------------------- Section 4: Customer information ------------------------- */}
        <section className="border-t border-line pt-8">
          <SectionHeader step={4}
            title="Customer Information"
            description="This is how we'll reach you with your offer, so double-check for typos."
          />
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }: { field: Field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input autoComplete="name" placeholder="e.g. Sam Parker" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }: { field: Field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }: { field: Field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="(254) 555-0123"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerZip"
              render={({ field }: { field: Field }) => (
                <FormItem>
                  <FormLabel>ZIP Code *</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      autoComplete="postal-code"
                      placeholder="5-digit ZIP code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerMessage"
              render={({ field }: { field: Field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Additional Message (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Anything for the team reviewing your vehicle…"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* ------------------------- Submit ------------------------- */}
        <div className="flex flex-col gap-4 border-t border-line pt-8">
          {submitting && (
            <div
              className="flex items-center justify-center"
              role="status"
              aria-live="polite"
            >
              <Progress value={uploadProgress} className="h-2 w-full max-w-sm" />
              <span className="ml-3 text-sm font-semibold text-ink-soft tabular-nums">
                {uploadProgress}%
              </span>
            </div>
          )}

          <Button
            type="submit"
            size="xl"
            className="w-full text-base"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="size-5 animate-spin" aria-hidden />
                Sending your vehicle…
              </>
            ) : (
              "Send my vehicle for an offer"
            )}
          </Button>

          <p className="flex items-start justify-center gap-2 text-center text-[13px] leading-relaxed text-ink-soft">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-gold-strong" aria-hidden />
            By submitting you agree to be contacted about your vehicle. Free
            evaluation — no obligation to accept any offer.
          </p>
        </div>
      </form>
    </Form>
  );
}
