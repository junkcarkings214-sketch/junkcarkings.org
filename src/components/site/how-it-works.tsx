import { PhoneCall } from "lucide-react";
import { siteConfig } from "@/lib/site";

const steps = [
  {
    title: "Tell us about the vehicle",
    copy: "Year, make, model, mileage, and what is wrong with it. Two minutes on your phone, standing in the driveway.",
  },
  {
    title: "Add a few photos",
    copy: "Optional, but the damage you show us is the offer you get. Honest answers have never cost anyone a dollar here.",
  },
  {
    title: "A person calls you back",
    copy: "Every notice is read by hand, then answered by phone or email. Take the offer, ask a question, or leave it.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="scroll-mt-24 bg-mist"
    >
      <div className="shell py-14 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[58ch]">
            <h2
              id="how-it-works-heading"
              className="mt-0 text-[clamp(1.9rem,3.4vw,2.75rem)] leading-[1.05] font-extrabold text-ink"
            >
              Three steps, one phone call.
            </h2>
          </div>
          <p className="max-w-[34ch] text-[15px] leading-relaxed text-ink-soft">
            No account, no listing, and nobody knocking on your door.
          </p>
        </div>

        <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-6">
          {steps.map((step, index) => (
            <li key={step.title} className="border-t-2 border-ink/15 pt-5">
              <span className="flex size-9 items-center justify-center rounded-full border border-ink/15 bg-surface text-sm font-bold text-ink tabular-nums">
                {index + 1}
              </span>
              <h3 className="mt-3 text-xl leading-tight font-bold text-ink">
                {step.title}
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">
                {step.copy}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col gap-4 rounded-xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-mist text-ink">
            <PhoneCall className="size-5" aria-hidden />
          </span>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            <strong className="font-semibold text-ink">A real person answers.</strong>{" "}
            Every notice is read by someone here in {siteConfig.serviceArea} — not a
            call center, and not an instant pricing widget. You can call us at{" "}
            <a
              href={siteConfig.phoneHref}
              className="font-semibold text-ink underline decoration-gold decoration-2 underline-offset-4"
            >
              {siteConfig.phone}
            </a>{" "}
            and a person will pick up.
          </p>
        </div>
      </div>
    </section>
  );
}
