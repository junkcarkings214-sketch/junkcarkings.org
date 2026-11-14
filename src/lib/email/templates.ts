import type { VehicleSubmissionRecord } from "@/lib/types";

/**
 * Build the "New Vehicle Submission" owner notification email.
 *
 * Table-based HTML for email-client compatibility, styled in the site's
 * identity: deep navy voice, one gold accent, warm sand surfaces. Cloudinary
 * photos render as a thumbnail grid linking to full-size originals; photos
 * without a delivery URL (local fallback) are listed as attached files.
 * All user-provided values are HTML-escaped before interpolation.
 */

const BRAND = {
  navy: "#0c1d47",
  navyDeep: "#081430",
  navyHover: "#1a3370",
  gold: "#f2b320",
  goldDeep: "#c98a06",
  paper: "#fbf7f1",
  sand: "#f4ede2",
  mist: "#f1eadf",
  line: "#e8dfd1",
  inkSoft: "#55607a",
  white: "#ffffff",
  blue: "#1d3fa0",
} as const;

/** Insert a resize transformation into a Cloudinary /upload/ delivery URL. */
function thumbUrl(url: string, width: number): string {
  return url.replace(/\/upload\//, `/upload/w_${width},f_auto,q_auto/`);
}

export function buildSubmissionEmailHtml(
  record: VehicleSubmissionRecord,
  submittedAt: Date,
): string {
  const esc = (value: string | number | undefined): string => {
    const s = value == null ? "" : String(value);
    return s
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  };

  const YesNo = (v: string) =>
    v === "yes" ? "Yes" : v === "no" ? "No" : "Not sure";

  const friendlyCondition: Record<string, string> = {
    excellent: "Excellent",
    "very-good": "Very good",
    good: "Good",
    fair: "Fair",
    poor: "Poor",
  };
  const friendlyTitle: Record<string, string> = {
    clean: "Clean title",
    lost: "Lost / missing",
    salvage: "Salvage title",
    unsure: "Not sure",
  };

  const submitted = submittedAt.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Chicago",
  });

  const vehicleLabel = `${record.vehicle.year} ${record.vehicle.make} ${record.vehicle.model}${record.vehicle.trim ? ` ${record.vehicle.trim}` : ""}`;
  const phoneDigits = record.customer.phone.replace(/[^0-9+]/g, "");

  const row = (label: string, value: string): string => `
    <tr>
      <td style="padding:8px 0;vertical-align:top;width:132px;font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:${BRAND.inkSoft};font-family:Arial,Helvetica,sans-serif;">${esc(label)}</td>
      <td style="padding:8px 0;color:${BRAND.navy};font-size:14px;line-height:1.5;font-family:Arial,Helvetica,sans-serif;">${value || `<span style="color:#a8b0c0;">—</span>`}</td>
    </tr>`;

  const sectionLabel = (text: string): string => `
    <p style="margin:26px 0 10px;font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:${BRAND.goldDeep};font-family:Arial,Helvetica,sans-serif;border-bottom:1px solid ${BRAND.line};padding-bottom:6px;">${esc(text)}</p>`;

  const chip = (text: string): string =>
    `<span style="display:inline-block;margin:0 6px 6px 0;padding:6px 12px;border-radius:10px;background:${BRAND.sand};border:1px solid ${BRAND.line};color:${BRAND.navy};font-size:12.5px;font-weight:700;font-family:Arial,Helvetica,sans-serif;">${esc(text)}</span>`;

  // Photos: thumbnail grid when hosted; a plain list when only attachments exist.
  const hostedPhotos = record.photos.filter((p) => p.url);
  const attachedPhotos = record.photos.filter((p) => !p.url);

  let photosSection: string;
  if (record.photos.length === 0) {
    photosSection = `<p style="margin:0;font-size:13.5px;color:${BRAND.inkSoft};font-family:Arial,Helvetica,sans-serif;">No photos were uploaded with this submission.</p>`;
  } else if (hostedPhotos.length > 0) {
    const gridRows: string[] = [];
    for (let i = 0; i < hostedPhotos.length; i += 2) {
      gridRows.push(
        `<tr>${hostedPhotos
          .slice(i, i + 2)
          .map(
            (p) => `
          <td style="padding:0 6px 6px 0;width:50%;" align="left">
            <a href="${esc(p.url)}" target="_blank" rel="noreferrer" style="text-decoration:none;">
              <img src="${esc(thumbUrl(p.url as string, 280))}" width="280" alt="Customer photo — ${esc(p.originalName)}" style="display:block;width:100%;max-width:280px;border-radius:10px;border:1px solid ${BRAND.line};" />
            </a>
          </td>`,
          )
          .join("")}${hostedPhotos.length % 2 === 1 && i === hostedPhotos.length - 1 ? `<td style="width:50%;">&nbsp;</td>` : ""}</tr>`,
      );
    }
    photosSection = `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        ${gridRows.join("")}
      </table>
      <p style="margin:6px 0 0;font-size:12px;color:${BRAND.inkSoft};font-family:Arial,Helvetica,sans-serif;">Click a photo for the full-size original.</p>
      ${
        attachedPhotos.length > 0
          ? `<p style="margin:10px 0 0;font-size:12.5px;color:${BRAND.inkSoft};font-family:Arial,Helvetica,sans-serif;">Also attached: ${attachedPhotos
              .map((p) => esc(p.originalName))
              .join(", ")}</p>`
          : ""
      }`;
  } else {
    photosSection = `<p style="margin:0;font-size:13.5px;color:${BRAND.inkSoft};font-family:Arial,Helvetica,sans-serif;">${attachedPhotos.length} photo${attachedPhotos.length === 1 ? "" : "s"} attached to this email.</p>`;
  }

  return `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
  </head>
  <body style="margin:0;padding:0;background:${BRAND.paper};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.paper};padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:${BRAND.white};border-radius:20px;overflow:hidden;border:1px solid ${BRAND.line};">
            <!-- Header -->
            <tr>
              <td style="background:${BRAND.navyDeep};padding:26px 32px 22px;">
                <p style="margin:0;font-size:12px;letter-spacing:2.4px;color:${BRAND.gold};font-weight:700;text-transform:uppercase;font-family:Arial,Helvetica,sans-serif;">Junk Car Kings</p>
                <h1 style="margin:8px 0 0;font-size:23px;line-height:1.25;font-weight:700;color:${BRAND.white};font-family:Arial,Helvetica,sans-serif;">New vehicle notice</h1>
              </td>
            </tr>

            <!-- Vehicle + quick actions -->
            <tr>
              <td style="padding:22px 32px 0;">
                <p style="margin:0 0 4px;font-size:12px;color:${BRAND.inkSoft};font-family:Arial,Helvetica,sans-serif;">Submitted ${esc(submitted)} · Central time</p>
                <p style="margin:0 0 16px;font-size:21px;font-weight:700;color:${BRAND.navy};font-family:Arial,Helvetica,sans-serif;">${esc(vehicleLabel)}</p>
                <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="padding-right:10px;">
                      <a href="tel:${esc(phoneDigits)}" style="display:inline-block;padding:12px 22px;border-radius:12px;background:${BRAND.navy};color:${BRAND.white};font-size:14px;font-weight:700;text-decoration:none;font-family:Arial,Helvetica,sans-serif;">Call ${esc(record.customer.fullName.split(" ")[0])}</a>
                    </td>
                    <td>
                      <a href="mailto:${esc(record.customer.email)}" style="display:inline-block;padding:12px 22px;border-radius:12px;background:${BRAND.sand};border:1px solid ${BRAND.line};color:${BRAND.navy};font-size:14px;font-weight:700;text-decoration:none;font-family:Arial,Helvetica,sans-serif;">Email customer</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:8px 32px 4px;font-family:Arial,Helvetica,sans-serif;">

                ${sectionLabel("Customer")}
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  ${row("Name", esc(record.customer.fullName))}
                  ${row("Email", `<a href="mailto:${esc(record.customer.email)}" style="color:${BRAND.blue};">${esc(record.customer.email)}</a>`)}
                  ${row("Phone", `<a href="tel:${esc(phoneDigits)}" style="color:${BRAND.blue};">${esc(record.customer.phone)}</a>`)}
                  ${row("Customer ZIP", esc(record.customer.zip))}
                </table>

                ${sectionLabel("Vehicle")}
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  ${row("Vehicle", esc(vehicleLabel))}
                  ${row("VIN", record.vehicle.vin ? esc(record.vehicle.vin) : "")}
                  ${row("Mileage", `${esc(record.vehicle.mileage.toLocaleString("en-US"))} mi`)}
                  ${row("Location ZIP", esc(record.vehicle.locationZip))}
                </table>

                ${sectionLabel("Condition")}
                <div style="margin:0 0 4px;">${chip(friendlyCondition[record.condition.condition] ?? record.condition.condition)}${chip(`Starts: ${YesNo(record.condition.starts)}`)}${chip(`Runs & drives: ${YesNo(record.condition.runs)}`)}${chip(esc(friendlyTitle[record.condition.titleStatus] ?? record.condition.titleStatus))}${chip(`Damage reported: ${YesNo(record.condition.damaged)}`)}${chip(`Catalytic converter: ${record.condition.catalyticConverter === "yes" ? "Missing / replaced" : record.condition.catalyticConverter === "no" ? "Present" : "Not sure"}`)}</div>
                ${
                  record.condition.additionalInfo
                    ? `<div style="margin:10px 0 0;padding:14px 16px;border-radius:12px;background:${BRAND.mist};border-left:3px solid ${BRAND.gold};font-size:14px;line-height:1.6;color:${BRAND.navy};font-family:Arial,Helvetica,sans-serif;"><strong style="display:block;margin-bottom:2px;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${BRAND.goldDeep};">Customer notes</strong>${esc(record.condition.additionalInfo)}</div>`
                    : ""
                }

                ${
                  record.customer.message
                    ? `<div style="margin:12px 0 0;padding:14px 16px;border-radius:12px;background:${BRAND.mist};border-left:3px solid ${BRAND.gold};font-size:14px;line-height:1.6;color:${BRAND.navy};font-family:Arial,Helvetica,sans-serif;"><strong style="display:block;margin-bottom:2px;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${BRAND.goldDeep};">Message to us</strong>${esc(record.customer.message)}</div>`
                    : ""
                }

                ${sectionLabel(`Photos (${record.photos.length})`)}
                ${photosSection}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:20px 32px 24px;border-top:1px solid ${BRAND.line};">
                <p style="margin:0;font-size:12px;color:${BRAND.inkSoft};font-family:Arial,Helvetica,sans-serif;">Reference <strong style="color:${BRAND.navy};">${esc(record.id)}</strong></p>
                <p style="margin:6px 0 0;font-size:12px;color:${BRAND.inkSoft};font-family:Arial,Helvetica,sans-serif;">Reply to this email to reach the customer directly.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildSubmissionEmailText(
  record: VehicleSubmissionRecord,
  submittedAt: Date,
): string {
  const lines: string[] = [
    `NEW VEHICLE NOTICE — Junk Car Kings`,
    ``,
    `Submitted: ${submittedAt.toISOString()}`,
    `Reference: ${record.id}`,
    ``,
    `VEHICLE`,
    `Vehicle: ${record.vehicle.year} ${record.vehicle.make} ${record.vehicle.model}${record.vehicle.trim ? ` ${record.vehicle.trim}` : ""}`,
    `VIN: ${record.vehicle.vin || "(not provided)"}`,
    `Mileage: ${record.vehicle.mileage.toLocaleString("en-US")}`,
    `Location ZIP: ${record.vehicle.locationZip}`,
    ``,
    `CUSTOMER`,
    `Name: ${record.customer.fullName}`,
    `Email: ${record.customer.email}`,
    `Phone: ${record.customer.phone}`,
    `ZIP: ${record.customer.zip}`,
    ``,
    `CONDITION`,
    `Overall: ${record.condition.condition}`,
    `Starts: ${record.condition.starts}`,
    `Runs & drives: ${record.condition.runs}`,
    `Title: ${record.condition.titleStatus}`,
    `Damaged: ${record.condition.damaged}`,
    `Catalytic converter: ${record.condition.catalyticConverter}`,
    record.condition.additionalInfo ? `Notes: ${record.condition.additionalInfo}` : "",
    record.customer.message ? `Message: ${record.customer.message}` : "",
    ``,
    `PHOTOS: ${record.photos.length}`,
    ...record.photos.map(
      (p) => `- ${p.originalName}${p.url ? ` — ${p.url}` : " (attached)"}`,
    ),
  ];
  return lines.filter((l) => l !== "").join("\n");
}
