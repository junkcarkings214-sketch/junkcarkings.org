import { STATUS_LABELS } from "@/lib/submissions";
import type { SubmissionStatus } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";
import { cn } from "cn";

const badgeClasses: Record<SubmissionStatus, string> = {
  new: "border-transparent bg-gold/20 text-amber-700",
  contacted: "border-transparent bg-primary/10 text-primary",
  offered: "border-transparent bg-emerald-100 text-emerald-700",
  closed: "border-transparent bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  return (
    <Badge className={cn("font-semibold", badgeClasses[status])}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
