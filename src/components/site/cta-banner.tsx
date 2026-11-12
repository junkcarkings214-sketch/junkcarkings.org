import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export function SubmitCta() {
  return (
    <section aria-labelledby="cta-heading" className="bg-paper">
      <div className="shell py-14 sm:py-20">
        <div className="relative isolate overflow-hidden rounded-2xl bg-navy-950">
          <Image
            src="/hero-junkyard.jpg"
            alt=""
            fill
            sizes="(max-width: 1200px) 100vw, 1160px"
            className="object-cover object-bottom"
          />
          <div aria-hidden className="absolute inset-0 bg-navy-950/80" />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/45"
          />

          <div className="relative px-6 py-10 text-white sm:px-10 sm:py-14">
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
              <div className="max-w-[38ch]">
                <h2
                  id="cta-heading"
                  className="mt-0 text-[clamp(2rem,4vw,3.25rem)] leading-[1.02] font-extrabold tracking-[-0.02em] text-white"
                >
                  Ready to Find Out What Your Car Is Worth?
                </h2>
                <p className="mt-4 text-[16px] leading-relaxed text-white/80">
                  Two minutes to tell us about it, then a person reads it and calls
                  you back. Free evaluation, no obligation to accept.
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
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-[15px] font-semibold text-white tabular-nums transition-colors hover:text-gold"
                >
                  <Phone className="size-4 text-gold" aria-hidden />
                  {siteConfig.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
