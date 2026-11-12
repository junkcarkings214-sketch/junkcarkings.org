import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Junk Car Kings is a locally focused vehicle buyer serving Central and North Texas. A real person reviews every submission.",
  alternates: { canonical: "/about" },
};

const points = [
  {
    title: "Locally focused",
    copy: `We serve ${siteConfig.serviceArea}. When you call, you reach someone who knows the area and your notice.`,
  },
  {
    title: "Reviewed by a person",
    copy: "Every submission is read by a real person — not priced by an instant widget. You get a straight answer.",
  },
  {
    title: "Free evaluation, no obligation",
    copy: "Requesting an offer costs nothing, and accepting is entirely your choice. No fees are taken out of an offer.",
  },
  {
    title: "Honesty welcome",
    copy: "Accurate condition details produce a fairer first offer. Describing the bad parts never costs you here.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-paper">
        <div className="shell pt-10 pb-16 sm:pt-14 sm:pb-20">
          <header className="max-w-[62ch]">
            <h1 className="text-[clamp(2.25rem,4.6vw,3.5rem)] leading-[1.02] font-extrabold tracking-[-0.025em] text-ink">
              About Junk Car Kings.
            </h1>
            <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">
              A locally focused buyer for unwanted vehicles. We make selling a
              junk car simple: tell us about it, and a real person gets back to
              you with an offer. No listing, no haggling, no strangers at the
              door.
            </p>
          </header>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {points.map((point) => (
              <div key={point.title} className="rounded-xl border border-line bg-surface p-6">
                <h2 className="text-lg font-bold text-ink">{point.title}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                  {point.copy}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-navy-950 px-6 py-10 text-white sm:px-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-[44ch]">
                <h2 className="text-[clamp(1.6rem,3vw,2.25rem)] leading-[1.05] font-extrabold text-white">
                  Ready to find out what your car is worth?
                </h2>
                <p className="mt-2 text-[15px] text-white/75">
                  Two minutes to tell us about it, then a person calls you back.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild variant="gold" size="xl">
                  <Link href="/sell-your-car">
                    Get My Offer
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </Button>
                <a
                  href={siteConfig.phoneHref}
                  className="inline-flex min-h-11 items-center gap-2 px-2 text-[15px] font-semibold text-white tabular-nums hover:text-gold"
                >
                  <Phone className="size-4 text-gold" aria-hidden />
                  {siteConfig.phone}
                </a>
              </div>
            </div>
            <p className="mt-6 flex items-center gap-2 text-[13px] text-white/60">
              <MapPin className="size-4" aria-hidden />
              Serving {siteConfig.serviceArea}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
