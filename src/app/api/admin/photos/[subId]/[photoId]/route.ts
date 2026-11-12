import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { hasAdminSession } from "@/lib/admin/auth";

/**
 * Authenticated photo streaming for the admin dashboard.
 * Images stay in `.data/` (outside `public/`) and are only served after the
 * session cookie is verified.
 */
export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/admin/photos/[subId]/[photoId]">,
) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { subId, photoId } = await ctx.params;
  const photo = await storage.readPhoto(subId, photoId);
  if (!photo) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(photo.buffer), {
    headers: {
      "Content-Type": photo.mimeType,
      "Cache-Control": "private, max-age=3600",
      "Content-Disposition": `inline; filename="${photo.filename}"`,
    },
  });
}
