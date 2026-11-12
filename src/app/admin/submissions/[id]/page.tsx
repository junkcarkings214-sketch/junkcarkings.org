import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ImageOff, Phone, Mail, MapPin } from "lucide-react";
import { AdminFooter, AdminHeader, AdminHeaderFallback } from "../../admin-header";
import { Skeleton } from "../../skeleton";
import { StatusBadge } from "../../status-badge";
import { requireAdmin } from "@/lib/admin/auth";
import { getVehicleSubmission, SUBMISSION_STATUSES, STATUS_LABELS } from "@/lib/submissions";
import { updateSubmissionStatus } from "../../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "cn";

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const CONDITION_LABELS: Record<string, string> = {
  excellent: "Excellent",
  "very-good": "Very good",
  good: "Good",
  fair: "Fair",
  poor: "Poor",
};

const TITLE_LABELS: Record<string, string> = {
  clean: "Clean title",
  salvage: "Salvage title",
  lost: "Lost / missing",
  unsure: "Not sure",
};

const YES_NO: Record<string, string> = {
  yes: "Yes",
  no: "No",
  unsure: "Not sure",
};

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-1 border-b border-border/60 py-2.5 last:border-0">
      <dt className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="text-sm text-foreground sm:max-w-[62%] sm:text-right">
        {children}
      </dd>
    </div>
  );
}

async function SubmissionDetailContent({ id }: { id: string }) {
  await requireAdmin();
  const submission = await getVehicleSubmission(id);

  if (!submission) {
    notFound();
  }

  const vehicleTitle = `${submission.vehicle.year} ${submission.vehicle.make} ${submission.vehicle.model}${submission.vehicle.trim ? ` ${submission.vehicle.trim}` : ""}`;

  return (
    <>
      <AdminHeader title={vehicleTitle} backHref="/admin/submissions" />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {/* summary strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-white p-4 shadow-none">
          <div>
            <p className="font-display text-lg font-bold">
              {submission.customer.fullName}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDateTime(submission.createdAt)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={submission.status} />
            <Button asChild variant="default" size="sm" className="h-9">
              <a href={`tel:${submission.customer.phone.replace(/[^+0-9]/g, "")}`}>
                <Phone className="size-4" aria-hidden />
                Call customer
              </a>
            </Button>
            <Button asChild variant="outline" size="sm" className="h-9">
              <a href={`mailto:${submission.customer.email}`}>
                <Mail className="size-4" aria-hidden />
                Email customer
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          {/* vehicle + condition */}
          <div className="grid gap-6">
            <Card className="shadow-none ring-1 ring-border">
              <CardHeader className="pb-2">
                <CardTitle className="font-display text-base">Vehicle Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl>
                  <DetailRow label="Vehicle">{vehicleTitle}</DetailRow>
                  <DetailRow label="VIN">{submission.vehicle.vin || "—"}</DetailRow>
                  <DetailRow label="Mileage">
                    {submission.vehicle.mileage.toLocaleString("en-US")} mi
                  </DetailRow>
                  <DetailRow label="Location ZIP">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5 text-primary" aria-hidden />
                      {submission.vehicle.locationZip}
                    </span>
                  </DetailRow>
                </dl>
              </CardContent>
            </Card>

            <Card className="shadow-none ring-1 ring-border">
              <CardHeader className="pb-2">
                <CardTitle className="font-display text-base">Vehicle Condition</CardTitle>
              </CardHeader>
              <CardContent>
                <dl>
                  <DetailRow label="Overall">
                    {CONDITION_LABELS[submission.condition.condition] ?? submission.condition.condition}
                  </DetailRow>
                  <DetailRow label="Starts?">
                    {YES_NO[submission.condition.starts] ?? submission.condition.starts}
                  </DetailRow>
                  <DetailRow label="Runs & drives?">
                    {YES_NO[submission.condition.runs] ?? submission.condition.runs}
                  </DetailRow>
                  <DetailRow label="Title">
                    {TITLE_LABELS[submission.condition.titleStatus] ?? submission.condition.titleStatus}
                  </DetailRow>
                  <DetailRow label="Damaged?">
                    {YES_NO[submission.condition.damaged] ?? submission.condition.damaged}
                  </DetailRow>
                  <DetailRow label="Catalytic converter">
                    {submission.condition.catalyticConverter === "yes"
                      ? "Missing / replaced"
                      : YES_NO[submission.condition.catalyticConverter] ?? submission.condition.catalyticConverter}
                  </DetailRow>
                  {submission.condition.additionalInfo ? (
                    <DetailRow label="Vehicle notes">
                      {submission.condition.additionalInfo}
                    </DetailRow>
                  ) : null}
                  {submission.customer.message ? (
                    <DetailRow label="Customer message">
                      {submission.customer.message}
                    </DetailRow>
                  ) : null}
                </dl>
              </CardContent>
            </Card>
          </div>

          {/* contact + photos + status */}
          <div className="grid gap-6">
            <Card className="shadow-none ring-1 ring-border">
              <CardHeader className="pb-2">
                <CardTitle className="font-display text-base">Customer</CardTitle>
              </CardHeader>
              <CardContent>
                <dl>
                  <DetailRow label="Name">{submission.customer.fullName}</DetailRow>
                  <DetailRow label="Phone">
                    <a className="text-primary hover:underline" href={`tel:${submission.customer.phone.replace(/[^+0-9]/g, "")}`}>
                      {submission.customer.phone}
                    </a>
                  </DetailRow>
                  <DetailRow label="Email">
                    <a className="text-primary hover:underline" href={`mailto:${submission.customer.email}`}>
                      {submission.customer.email}
                    </a>
                  </DetailRow>
                  <DetailRow label="ZIP">{submission.customer.zip}</DetailRow>
                </dl>
              </CardContent>
            </Card>

            <Card className="shadow-none ring-1 ring-border">
              <CardHeader className="pb-2">
                <CardTitle className="font-display text-base">
                  Photos {submission.photos.length > 0 ? `(${submission.photos.length})` : ""}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {submission.photos.length === 0 ? (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ImageOff className="size-4" aria-hidden />
                    No photos were uploaded with this submission.
                  </p>
                ) : (
                  <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
                    {submission.photos.map((photo, i) => (
                      <li key={photo.id}>
                        <a
                          href={
                            photo.url ??
                            `/api/admin/photos/${submission.id}/${photo.id}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          title={photo.originalName}
                          className="group block overflow-hidden rounded-lg border bg-muted"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              photo.url ??
                              `/api/admin/photos/${submission.id}/${photo.id}`
                            }
                            alt={`Customer photo ${i + 1}`}
                            loading="lazy"
                            className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-none ring-1 ring-border">
              <CardHeader className="pb-2">
                <CardTitle className="font-display text-base">Update Status</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {SUBMISSION_STATUSES.map((status) => {
                  const active = submission.status === status;
                  return (
                    <form key={status} action={updateSubmissionStatus}>
                      <input type="hidden" name="id" value={submission.id} />
                      <input type="hidden" name="status" value={status} />
                      <Button
                        type="submit"
                        variant={active ? "default" : "outline"}
                        size="sm"
                        className={cn("h-9", active && "pointer-events-none")}
                        aria-current={active ? "true" : undefined}
                      >
                        {STATUS_LABELS[status]}
                      </Button>
                    </form>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <AdminFooter />
    </>
  );
}

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Session + record reads are request-time data → defer into Suspense.
  // `params` itself is runtime data too (Cache Components), so it must be
  // awaited inside the boundary as well.
  const fallback = (
    <>
      <AdminHeaderFallback />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <Skeleton className="h-20" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </main>
    </>
  );

  return (
    <Suspense fallback={fallback}>
      <SubmissionDetailLoader params={params} />
    </Suspense>
  );
}

async function SubmissionDetailLoader({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    notFound();
  }
  return <SubmissionDetailContent id={id} />;
}
