import { cn } from "cn";

/** Tiny loading placeholder used by the admin pages' Suspense fallbacks. */
export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}
