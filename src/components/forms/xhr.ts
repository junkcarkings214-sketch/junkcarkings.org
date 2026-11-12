/**
 * Client-side uploader that submits the payload + photo files via XHR so we
 * can surface real upload progress to the customer.
 */
export type UploadResult =
  | { kind: "success"; reference?: string }
  | { kind: "error"; message: string };

export function submitVehicleSubmission(
  payload: unknown,
  photos: File[],
  onProgress: (percent: number) => void,
): Promise<UploadResult> {
  const data = new FormData();
  data.append("payload", JSON.stringify(payload));
  for (const photo of photos) {
    data.append("photos", photo, photo.name);
  }

  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/vehicle-submissions");

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      let message = "";
      try {
        const body = JSON.parse(xhr.responseText) as {
      ok: boolean;
      error?: string;
      reference?: string;
    };
        if (xhr.status >= 200 && xhr.status < 300 && body.ok) {
          resolve({ kind: "success", reference: body.reference });
          return;
        }
        message = body.error || "Submission failed. Please try again.";
      } catch {
        message = `Unexpected server response (HTTP ${xhr.status}).`;
      }
      resolve({ kind: "error", message });
    });

    xhr.addEventListener("error", () => {
      resolve({
        kind: "error",
        message: "We couldn't reach the server. Check your connection and try again.",
      });
    });

    xhr.addEventListener("abort", () => {
      resolve({ kind: "error", message: "Submission was canceled." });
    });

    xhr.send(data);
  });
}
