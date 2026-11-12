import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

const assurances = ["Free evaluation", "No obligation", "A real person answers"];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950">
      <Image
        src="/hero-junkyard.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/80 to-navy-950/35"
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-navy-950/60 to-transparent" />

      <div className="shell relative pt-14 pb-24 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-28">
        <div className="max-w-[640px] text-white">
          <h1 className="text-[clamp(2.6rem,5.8vw,4.6rem)] leading-[1.02] font-bold tracking-[-0.03em] text-white">
            Turn your unwanted car into an offer.
          </h1>

          <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-white/85 sm:text-[19px]">
            Running, wrecked, rusted, or just in the way. Tell us about it, and a
            real person here reviews it and calls you back with an offer you are
            free to say no to.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button asChild variant="gold" size="xl" className="w-full sm:w-auto">
              <Link href="/sell-your-car">
                Get my offer
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <a
              href={siteConfig.phoneHref}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-[15px] font-semibold text-white transition-colors hover:text-gold sm:justify-start"
            >
              <Phone className="size-4 text-gold" aria-hidden />
              or call {siteConfig.phone}
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-white/85">
            {assurances.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="size-4 text-gold" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
