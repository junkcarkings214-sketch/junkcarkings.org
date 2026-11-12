import { Suspense } from "react";
import Link from "next/link";
import { Inbox, Phone, Clock3, FileText, ChevronRight } from "lucide-react";
import { AdminFooter, AdminHeader, AdminHeaderFallback } from "./admin-header";
import { Skeleton } from "./skeleton";
import { StatusBadge } from "./status-badge";
import { requireAdmin } from "@/lib/admin/auth";
import { listVehicleSubmissions } from "@/lib/submissions";
import { Card, CardContent } from "@/components/ui/card";

// ---------------------------------------------------------------------------

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------

async function DashboardContent() {
  await requireAdmin();
  const submissions = await listVehicleSubmissions();

  const stats = [
    { label: "Total submissions", value: submissions.length },
    {
      label: "New (needs review)",
      value: submissions.filter((s) => s.status === "new").length,
    },
    {
      label: "Contacted",
      value: submissions.filter((s) => s.status === "contacted").length,
    },
    {
      label: "Offer sent",
      value: submissions.filter((s) => s.status === "offered").length,
    },
  ];

  const recent = submissions.slice(0, 5);

  return (
    <>
      <AdminHeader
        title="Vehicle Submissions Dashboard"
        subtitle="Review customer vehicle submissions and follow up with your offer by phone or email."
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {/* stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Submission statistics">
          {stats.map((stat) => (
            <Card key={stat.label} className="shadow-none ring-1 ring-border">
              <CardContent className="p-5">
                <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  {stat.label}
                </p>
                <p className="font-display mt-2 text-3xl font-extrabold text-foreground">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* recent submissions */}
        <div className="mt-10">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-lg font-extrabold">
              Recent Submissions
            </h2>
            <Link
              href="/admin/submissions"
              className="text-sm font-semibold text-primary transition-colors hover:text-primary/80"
            >
              View all →
            </Link>
          </div>

          {submissions.length === 0 ? (
            <Card className="mt-4 shadow-none ring-1 ring-border">
              <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Inbox className="size-6" aria-hidden />
                </span>
                <p className="font-semibold">No submissions yet</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  New vehicle submissions will appear here as soon as customers
                  use the online form.
                </p>
              </CardContent>
            </Card>
          ) : (
            <ul className="mt-4 grid gap-3">
              {recent.map((sub) => (
                <li key={sub.id}>
                  <Link
                    href={`/admin/submissions/${sub.id}`}
                    className="group flex items-center justify-between gap-4 rounded-xl border bg-white p-4 shadow-none transition-all hover:border-primary/40 hover:shadow-sm"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-display font-bold">
                          {sub.customer.fullName}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {sub.vehicle.year} {sub.vehicle.make} {sub.vehicle.model}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock3 className="size-3" aria-hidden />
                          {formatDateTime(sub.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="size-3" aria-hidden />
                          {sub.customer.phone}
                        </span>
                        <span>{sub.customer.email}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <StatusBadge status={sub.status} />
                      <ChevronRight
                        className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                        aria-hidden
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* how to use */}
        <div className="mt-10 rounded-xl border bg-white p-6 shadow-none">
          <h2 className="font-display flex items-center gap-2 text-sm font-extrabold">
            <FileText className="size-4 text-primary" aria-hidden />
            Handy reminders
          </h2>
          <ul className="mt-3 grid gap-1.5 text-sm text-muted-foreground sm:grid-cols-2">
            <li>• Work top-down: &quot;New&quot; submissions are waiting for your first contact.</li>
            <li>• Update the status badge after each call so nothing slips through.</li>
            <li>• Photos are visible on each submission&apos;s detail page.</li>
            <li>• Customer phone numbers are links — tap to call on mobile.</li>
          </ul>
        </div>
      </main>
      <AdminFooter />
    </>
  );
}

export function DashboardContentSkeleton() {
  return (
    <>
      <AdminHeaderFallback />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="mt-10 h-8 w-48" />
        <div className="mt-4 grid gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </main>
    </>
  );
}

/**
 * Session + submission data are request-time values, so they're deferred into
 * a Suspense boundary (required by Cache Components).
 */
export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<DashboardContentSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
