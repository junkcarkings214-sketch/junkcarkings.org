import Link from "next/link";
import { ChevronLeft, LayoutDashboard } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { LogoutButton } from "./logout-button";

export function AdminHeader({
  title,
  subtitle,
  backHref,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
}) {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-primary"
            aria-label="View public site"
          >
            <Logo className="hidden h-9 sm:block" />
          </Link>
          {backHref ? (
            <Link
              href={backHref}
              className="flex items-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              <ChevronLeft className="size-4" aria-hidden />
              All submissions
            </Link>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-secondary-foreground">
            <LayoutDashboard className="size-3.5" aria-hidden />
            Owner Dashboard
          </span>
          <LogoutButton />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-5 sm:px-6">
        <h1 className="font-display text-2xl font-extrabold">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
    </header>
  );
}

export function AdminHeaderFallback() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
        <div className="h-8 w-72 animate-pulse rounded-md bg-muted" />
      </div>
    </header>
  );
}

export function AdminFooter() {
  return (
    <footer className="border-t bg-white py-5 text-center text-xs text-muted-foreground">
      Junk Car Kings Owner Dashboard — customer data is private; do not share
      outside the business.
    </footer>
  );
}
