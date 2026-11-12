import Image from "next/image";
import { cn } from "cn";
import { siteConfig } from "@/lib/site";

/**
 * The real company logo (public/logo.png, 1672x941).
 * `variant="light"` is used — the source art has a transparent background,
 * which sits cleanly on both white and navy surfaces.
 */
export function Logo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo.png"
      alt={`${siteConfig.name} — ${siteConfig.tagline}`}
      width={1672}
      height={941}
      priority={priority}
      sizes="(max-width: 640px) 220px, 300px"
      className={cn("h-12 w-auto md:h-14", className)}
    />
  );
}
