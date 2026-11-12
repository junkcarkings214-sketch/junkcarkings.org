import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Reach Junk Car Kings by phone or email, or submit your vehicle online to get an offer.",
  alternates: { canonical: "/contact" },
};

const channels = [
  {
    icon: Phone,
    label: "Fastest",
    title: "Call or text",
    value: siteConfig.phone,
    href: siteConfig.phoneHref,
    note: "A person picks up during business hours. No phone tree, no queue.",
    external: true,
  },
  {
    icon: Mail,
    label: "Written",
    title: "Email us",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    note: "Every message is read and answered, usually the same day.",
    external: true,
  },
  {
    icon: MapPin,
    label: "Service area",
    title: "Where we work",
    value: siteConfig.serviceArea,
    href: null,
    note: "A locally focused buyer, not a national lead desk. Tell us the ZIP where the vehicle sits.",
    external: false,
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-paper">
        <div className="shell pt-10 pb-16 sm:pt-14 sm:pb-20">
          <header className="max-w-[62ch]">
            <h1 className="mt-0 text-[clamp(2.5rem,5.4vw,4rem)] leading-[1.0] font-extrabold tracking-[-0.03em] text-ink">
              A real person answers.
            </h1>
            <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">
              Questions about a vehicle, or an offer you already got? Call, write,
              or send us the details — all three reach the same small team in{" "}
              {siteConfig.serviceArea}.
            </p>
          </header>

          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {channels.map((channel) => {
              const body = (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-mist text-ink">
                      <channel.icon className="size-5" aria-hidden />
                    </span>
                    <span className="text-[12px] font-semibold tracking-[0.14em] uppercase text-ink-soft">
                      {channel.label}
                    </span>
                  </div>
                  <h2 className="mt-5 text-lg font-bold text-ink">{channel.title}</h2>
                  <p className="mt-2 text-[17px] leading-snug font-semibold break-words text-ink">
                    {channel.value}
                  </p>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-soft">
                    {channel.note}
                  </p>
                </>
              );

              const shell =
                "flex h-full flex-col rounded-xl border border-line bg-surface p-6";

              return channel.href ? (
                <a
                  key={channel.title}
                  href={channel.href}
                  className={`${shell} transition-colors hover:border-ink/35`}
                >
                  {body}
                </a>
              ) : (
                <div key={channel.title} className={shell}>
                  {body}
                </div>
              );
            })}
          </div>

          <section className="mt-8 rounded-2xl bg-navy-950 px-6 py-10 text-white sm:px-10 sm:py-12">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-12">
              <div className="max-w-[42ch]">
                <p className="text-[13px] font-semibold tracking-[0.14em] uppercase text-gold">
                  Want the offer instead?
                </p>
                <h2 className="mt-3 text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.05] font-extrabold text-white">
                  Send us the vehicle. We read it, then call.
                </h2>
                <p className="mt-3 text-[15.5px] leading-relaxed text-white/75">
                  Year, make, model, a few details, and the number to reach you.
                  Free evaluation, no obligation to accept.
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-start gap-3 sm:flex-row sm:items-center">
                <Button asChild variant="gold" size="xl">
                  <Link href="/sell-your-car">
                    Start my offer
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </Button>
                <a
                  href={siteConfig.phoneHref}
                  className="inline-flex min-h-11 items-center gap-2 px-2 text-[15px] font-semibold text-white tabular-nums transition-colors hover:text-gold"
                >
                  <Phone className="size-4 text-gold" aria-hidden />
                  {siteConfig.phone}
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
