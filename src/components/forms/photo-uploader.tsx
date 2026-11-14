"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ImageOff, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "cn";
import { PHOTO_LIMITS } from "@/lib/validation/vehicle-submission";

export interface UploadedPhoto {
  file: File;
  url: string;
}

export function validateUpcomingPhotos(
  existing: UploadedPhoto[],
  files: File[],
): string[] {
  const errors: string[] = [];
  const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);

  if (existing.length + files.length > PHOTO_LIMITS.maxCount) {
    errors.push(`You can upload at most ${PHOTO_LIMITS.maxCount} photos.`);
    return errors;
  }

  for (const file of files) {
    if (!allowed.has(file.type) || !/\.(jpe?g|png|webp)$/i.test(file.name)) {
      errors.push(`"${file.name}" isn't a JPG, PNG, or WEBP image.`);
      continue;
    }
    if (file.size > PHOTO_LIMITS.maxSize) {
      errors.push(
        `"${file.name}" is larger than ${Math.round(PHOTO_LIMITS.maxSize / 1024 / 1024)} MB.`,
      );
    }
  }

  return errors;
}

export function PhotoUploader({
  value,
  onChange,
  disabled = false,
}: {
  value: UploadedPhoto[];
  onChange: (photos: UploadedPhoto[]) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const inputId = useId();

  const addFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      const files = Array.from(fileList);
      const nextErrors = validateUpcomingPhotos(value, files);
      setErrors(nextErrors);

      const accepted = files.filter(
        (file) =>
          ["image/jpeg", "image/png", "image/webp"].includes(file.type) &&
          /\.(jpe?g|png|webp)$/i.test(file.name) &&
          file.size <= PHOTO_LIMITS.maxSize,
      );
      const room = Math.max(0, PHOTO_LIMITS.maxCount - value.length);
      const photos = accepted.slice(0, room).map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      if (photos.length > 0) onChange([...value, ...photos]);
    },
    [onChange, value],
  );

  useEffect(() => {
    return () => {
      for (const photo of value) URL.revokeObjectURL(photo.url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function remove(url: string) {
    const target = value.find((photo) => photo.url === url);
    if (target) URL.revokeObjectURL(target.url);
    onChange(value.filter((photo) => photo.url !== url));
  }

  return (
    <div>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!disabled) addFiles(event.dataTransfer.files);
        }}
        onClick={() => {
          if (!disabled) inputRef.current?.click();
        }}
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-labelledby={inputId}
        aria-describedby="photo-help"
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-line bg-paper px-6 py-10 text-center transition-colors outline-none",
          "hover:border-ink/30 hover:bg-mist/70 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink",
          dragging && "border-ink bg-mist",
          disabled && "pointer-events-none opacity-60",
        )}
      >
        <span className="flex size-11 items-center justify-center rounded-full bg-mist text-ink">
          <UploadCloud className="size-5" aria-hidden />
        </span>
        <p id={inputId} className="text-[15px] font-medium text-ink">
          <span className="sr-only">Upload photos (required). </span>
          Drag &amp; drop photos here, or{" "}
          <span className="font-semibold text-ink underline decoration-gold decoration-2 underline-offset-4">
            browse your device
          </span>
        </p>
        <p id="photo-help" className="text-[13px] text-ink-soft">
          JPG, PNG, or WEBP · up to {Math.round(PHOTO_LIMITS.maxSize / 1024 / 1024)} MB
          each · up to {PHOTO_LIMITS.maxCount} photos
        </p>
        <Input
          ref={inputRef}
          id={`${inputId}-input`}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          multiple
          disabled={disabled}
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
          className="sr-only"
          tabIndex={-1}
          aria-hidden
        />
      </div>

      {errors.length > 0 && (
        <ul
          role="alert"
          className="mt-3 space-y-1 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-[13px] text-destructive"
        >
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      {value.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((photo) => (
            <li
              key={photo.url}
              className="group relative overflow-hidden rounded-lg border border-line bg-mist"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt="Uploaded vehicle photo"
                className="aspect-[4/3] w-full object-cover"
              />
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                onClick={(event) => {
                  event.stopPropagation();
                  remove(photo.url);
                }}
                aria-label="Remove photo"
              >
                <Trash2 className="size-4" aria-hidden />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {value.length === 0 && (
        <p className="mt-3 flex items-center gap-1.5 text-[13px] text-ink-soft">
          <ImageOff className="size-3.5" aria-hidden />
          No photos yet. You can still submit without them.
        </p>
      )}
    </div>
  );
}
