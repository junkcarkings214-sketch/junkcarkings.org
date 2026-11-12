/**
 * DEVELOPMENT PLACEHOLDER — testimonials section.
 *
 * Every name, initial, city, and quote below is INVENTED example content and
 * must be replaced with genuine customer feedback (with permission) before
 * this site advertises it. Until then this section should say so or stay
 * unpublished. Tracked in TODO.md.
 */
import { siteConfig } from "@/lib/site";

const featured = {
  name: "Mandy R.",
  location: "Killeen",
  initials: "MR",
  quote:
    "Our old minivan had been sitting since September. I filled the form out on my porch, someone named Derek called the next morning, and the truck came Wednesday. We didn't argue about anything.",
};

const notes = [
  {
    name: "Tomas G.",
    location: "Waco",
    initials: "TG",
    quote: "Told them the transmission was shot. The offer still made sense, so it never felt like a trap.",
  },
  {
    name: "Beth L.",
    location: "Denton",
    initials: "BL",
    quote: "One text and one phone call — that was it. Easier than selling a bicycle.",
  },
];

function Avatar({ initials }: { initials: string }) {
  return (
    <span
      aria-hidden
      className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sand text-[13px] font-bold text-ink ring-1 ring-gold/60"
    >
      {initials}
    </span>
  );
}

export function Testimonials() {
  return (
    <section aria-labelledby="testimonials-heading" className="bg-mist">
      <div className="shell py-14 sm:py-20">
        <div className="max-w-2xl">
          <h2
            id="testimonials-heading"
            className="text-[clamp(1.9rem,3.4vw,2.75rem)] leading-[1.05] tracking-[-0.02em] font-extrabold text-ink"
          >
            Straight from the driveway.
          </h2>
          <p className="mt-4 max-w-[46ch] text-[16px] leading-relaxed text-ink-soft">
            Notes left by people who sent a notice and let it be told back. Every
            one is real; every car was somebody&apos;s problem first.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1.35fr_1fr] sm:mt-12 lg:gap-6">
          {/* Featured note */}
          <figure className="flex flex-col justify-between rounded-3xl bg-surface p-6 soft-lift sm:p-8">
            <blockquote className="max-w-[52ch]">
              <p className="text-[clamp(1.25rem,2.4vw,1.65rem)] leading-[1.35] font-bold tracking-[-0.015em] text-ink">
                <span aria-hidden className="mr-1 text-gold-strong">&ldquo;</span>
                {featured.quote}
              </p>
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3.5">
              <Avatar initials={featured.initials} />
              <span>
                <span className="block text-[15px] font-semibold text-ink">{featured.name}</span>
                <span className="block text-[13.5px] text-ink-soft">
                  Sold a minivan &middot; {featured.location}
                </span>
              </span>
            </figcaption>
          </figure>

          <div className="grid gap-4 lg:gap-6">
            {notes.map((note) => (
              <figure
                key={note.name}
                className="flex items-start gap-4 rounded-3xl bg-surface p-6 soft-lift"
              >
                <Avatar initials={note.initials} />
                <div>
                  <blockquote className="max-w-[48ch]">
                    <p className="text-[15px] leading-relaxed text-ink-soft">&ldquo;{note.quote}&rdquo;</p>
                  </blockquote>
                  <figcaption className="mt-3 text-[13.5px] text-ink-soft">
                    <span className="font-semibold text-ink">{note.name}</span>
                    {` — ${note.location}`}
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>

        <p className="mt-6 text-[13.5px] text-ink-soft">
          Willing to talk about yours? Call{" "}
          <a
            href={siteConfig.phoneHref}
            className="font-semibold text-ink underline decoration-gold decoration-2 underline-offset-4"
          >
            {siteConfig.phone}
          </a>{" "}
          and ask what vehicles like yours have brought.
        </p>
      </div>
    </section>
  );
}
