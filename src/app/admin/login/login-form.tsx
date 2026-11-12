"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: String(data.get("password") ?? "") }),
      });
      const body = (await response.json()) as { ok: boolean; error?: string };

      if (body.ok) {
        router.replace("/admin");
        router.refresh();
        return;
      }
      setError(body.error ?? "Incorrect password.");
    } catch {
      setError("Network error — please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <LockKeyhole className="size-6" aria-hidden />
        </span>
        <CardTitle className="font-display text-xl font-extrabold">Owner Sign In</CardTitle>
        <CardDescription>
          Private business area — authorized users only.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4" autoComplete="on">
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive"
            >
              {error}
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="admin-password">Admin password</Label>
            <Input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              autoFocus
              disabled={busy}
            />
          </div>
          <Button type="submit" variant="gold" className="h-10 font-bold" disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            Sign in
          </Button>
          <p className="text-center text-[13px] text-muted-foreground">
            Customer here? <Link href="/" className="text-primary hover:underline">Return to the public site</Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
