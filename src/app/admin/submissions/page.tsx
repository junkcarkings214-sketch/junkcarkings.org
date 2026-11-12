import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight, Clock3, Phone } from "lucide-react";
import { AdminFooter, AdminHeader, AdminHeaderFallback } from "../admin-header";
import { Skeleton } from "../skeleton";
import { StatusBadge } from "../status-badge";
import { requireAdmin } from "@/lib/admin/auth";
import { listVehicleSubmissions } from "@/lib/submissions";
import { Card, CardContent } from "@/components/ui/card";

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

async function SubmissionListContent() {
  await requireAdmin();
  const submissions = await listVehicleSubmissions();

  return (
    <>
      <AdminHeader
        title="All Submissions"
        subtitle={
          submissions.length === 0
            ? "Nothing here yet."
            : `${submissions.length} customer submission${submissions.length === 1 ? "" : "s"}, newest first.`
        }
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {submissions.length === 0 ? (
          <Card className="shadow-none ring-1 ring-border">
            <CardContent className="py-14 text-center text-sm text-muted-foreground">
              Submissions from the public form will show up here.
            </CardContent>
          </Card>
        ) : (
          <ul className="grid gap-3">
            {submissions.map((sub) => (
              <li key={sub.id}>
                <Link
                  href={`/admin/submissions/${sub.id}`}
                  className="group flex items-center justify-between gap-4 rounded-xl border bg-white p-4 transition-all hover:border-primary/40 hover:shadow-sm"
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
      </main>
      <AdminFooter />
    </>
  );
}

export default function SubmissionsListPage() {
  return (
    <Suspense fallback={
      <>
        <AdminHeaderFallback />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
          <div className="grid gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        </main>
      </>
    }>
      <SubmissionListContent />
    </Suspense>
  );
}
