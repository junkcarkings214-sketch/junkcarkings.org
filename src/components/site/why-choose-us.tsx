import { BadgeCheck, HandCoins, HeartHandshake, MessageSquareText, Phone, ShieldCheck, Truck } from "lucide-react";
import { siteConfig } from "@/lib/site";

const benefits = [
  {
    icon: HandCoins,
    title: "Free evaluation",
    copy: "We read your notice and look at the photos at no cost. No fee is ever taken out of an offer.",
  },
  {
    icon: BadgeCheck,
    title: "No obligation",
    copy: "An offer is an offer, not a commitment. Say no and nothing happens — no follow-up pressure.",
  },
  {
    icon: MessageSquareText,
    title: "Any condition, any reason",
    copy: "Running, dead, wrecked, rusted, or simply unwanted. Tell us the bad parts; they are part of the price.",
  },
  {
    icon: Truck,
    title: "Cars, trucks, vans & more",
    copy: "Daily drivers, work trucks, family SUVs, and the project that never got finished.",
  },
  {
    icon: ShieldCheck,
    title: "No listing, no haggling",
    copy: "You will not be posting ads, meeting strangers, or negotiating in a parking lot. One notice is enough.",
  },
  {
    icon: HeartHandshake,
    title: "Local and answerable",
    copy: `The person who reads your notice is the person who calls. You can reach us at ${siteConfig.phone}.`,
  },
];

export function WhyChooseUs() {
  return (
    <section aria-labelledby="why-us-heading" className="bg-paper">
      <div className="shell py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h2
              id="why-us-heading"
              className="text-[clamp(1.9rem,3.4vw,2.75rem)] leading-[1.05] font-extrabold text-ink"
            >
              Why sellers choose Junk Car Kings.
            </h2>
            <p className="mt-4 max-w-[38ch] text-[16px] leading-relaxed text-ink-soft">
              No hype and no fine print. These are the promises we make, written
              down here so you can hold us to them.
            </p>

            <div className="mt-8 rounded-2xl bg-navy-950 p-6 text-white">
              <p className="text-[13px] font-semibold tracking-[0.14em] uppercase text-gold">
                Prefer to talk first?
              </p>
              <a
                href={siteConfig.phoneHref}
                className="mt-2 flex items-center gap-2 text-2xl font-bold text-white tabular-nums transition-colors hover:text-gold"
              >
                <Phone className="size-5 text-gold" aria-hidden />
                {siteConfig.phone}
              </a>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-white/75">
                Call or text and a person picks up — we will take the details
                over the phone if you would rather not type them out.
              </p>
            </div>
          </div>

          <ul className="divide-y divide-line border-y border-line">
            {benefits.map((benefit) => (
              <li key={benefit.title} className="flex items-start gap-4 py-5 sm:gap-5 sm:py-6">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sand text-ink">
                  <benefit.icon className="size-4 text-gold-strong" aria-hidden />
                </span>
                <div>
                  <h3 className="text-[15.5px] font-bold text-ink">{benefit.title}</h3>
                  <p className="mt-1.5 max-w-[54ch] text-[14.5px] leading-relaxed text-ink-soft">
                    {benefit.copy}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
