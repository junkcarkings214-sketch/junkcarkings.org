"use server";

import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/admin/auth";
import { SUBMISSION_STATUSES, setSubmissionStatus } from "@/lib/submissions";
import type { SubmissionStatus } from "@/lib/storage";

/**
 * Update a submission's workflow status. Guarded by the admin session —
 * the action fails closed (returns without changing anything) otherwise.
 */
export async function updateSubmissionStatus(formData: FormData): Promise<void> {
  if (!(await hasAdminSession())) {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as SubmissionStatus;

  if (!id || !SUBMISSION_STATUSES.includes(status)) {
    redirect(`/admin/submissions/${id}`);
  }

  await setSubmissionStatus(id, status);
  redirect(`/admin/submissions/${id}`);
}
