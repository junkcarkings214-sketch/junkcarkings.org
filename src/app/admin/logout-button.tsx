"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch("/api/admin/auth/logout", { method: "POST" });
        router.replace("/admin/login");
        router.refresh();
      }}
    >
      <LogOut className="size-4" aria-hidden />
      Sign out
    </Button>
  );
}
