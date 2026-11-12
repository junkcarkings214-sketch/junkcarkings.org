"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const FIELDS = [
  { key: "year", label: "Year", placeholder: "2004", inputMode: "numeric", maxLength: 4 },
  { key: "make", label: "Make", placeholder: "Ford", inputMode: "text", maxLength: 24 },
  { key: "model", label: "Model", placeholder: "F-150", inputMode: "text", maxLength: 32 },
] as const;

/**
 * The first step of the offer, kept on the home page. Values carry into the
 * full submission form as query parameters so nobody types a vehicle twice.
 */
export function OfferStart() {
  const router = useRouter();
  const uid = useId();
  const [values, setValues] = useState({ year: "", make: "", model: "" });

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    for (const { key } of FIELDS) {
      const value = values[key].trim();
      if (value) params.set(key, value);
    }
    const query = params.toString();
    router.push(`/sell-your-car${query ? `?${query}` : ""}`);
  }

  return (
    <section id="offer" aria-labelledby="offer-start-heading" className="relative z-10 -mt-14 scroll-mt-24 sm:-mt-16 lg:-mt-20">
      <div className="shell pb-10 lg:pb-14">
        <form
          onSubmit={submit}
          className="rounded-2xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(12,29,71,0.05),0_24px_48px_-20px_rgba(8,20,48,0.55)] sm:p-7"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
            <div>
              <h2
                id="offer-start-heading"
                className="text-xl leading-tight font-bold text-ink"
              >
                Start with your vehicle
              </h2>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
                Year, make, model. Takes about two minutes.
              </p>
            </div>
            <p className="text-[13px] text-ink-soft sm:text-right">
              Free evaluation. No obligation. No account needed.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-5">
            {FIELDS.map((field) => (
              <div key={field.key} className="min-w-0 flex-1 sm:min-w-[9rem]">
                <label
                  htmlFor={`${uid}-${field.key}`}
                  className="block text-[13px] font-medium text-ink-soft"
                >
                  {field.label}
                </label>
                <input
                  id={`${uid}-${field.key}`}
                  name={field.key}
                  value={values[field.key]}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      [field.key]: event.target.value,
                    }))
                  }
                  placeholder={field.placeholder}
                  inputMode={field.inputMode}
                  maxLength={field.maxLength}
                  autoComplete="off"
                  className="mt-1.5 h-12 w-full rounded-lg border border-line bg-paper px-3 text-[16px] text-ink transition-colors placeholder:text-ink-soft hover:border-ink/30 focus:border-ink focus:bg-white"
                />
              </div>
            ))}
            <Button
              type="submit"
              size="lg"
              className="h-12 self-end px-6 max-sm:w-full max-sm:justify-center"
            >
              Continue
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
