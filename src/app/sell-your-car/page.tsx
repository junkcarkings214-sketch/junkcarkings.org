import type { Metadata } from "next";
import { Lock, Phone } from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { VehicleSubmissionForm } from "@/components/forms/vehicle-submission-form";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sell Your Car — Get an Offer",
  description:
    "Tell us about your junk car or truck, upload photos, and get an offer from Junk Car Kings. Free evaluation, no obligation.",
  alternates: { canonical: "/sell-your-car" },
};

export default function SellYourCarPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-paper">
        <div className="shell pt-10 pb-16 sm:pt-14 sm:pb-20">
          <header className="mx-auto max-w-3xl">
            <h1 className="text-[clamp(2.25rem,4.6vw,3.5rem)] leading-[1.02] font-extrabold tracking-[-0.025em] text-ink">
              Tell us about the vehicle.
            </h1>
            <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">
              Two or three minutes on your phone, standing in the driveway. Fill in
              what you know, add photos if you have them, and leave a number. One
              person here reads every notice.
            </p>
          </header>

          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-line bg-surface p-5 sm:p-8">
            <VehicleSubmissionForm />
          </div>

          <div className="mx-auto mt-8 grid max-w-3xl gap-5 sm:grid-cols-2">
            <div className="rounded-xl bg-navy-950 p-6 text-white">
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
              <p className="mt-3 text-[14.5px] leading-relaxed text-white/75">
                Call or text and a person picks up. We will take the details over
                the phone if you would rather not type them out.
              </p>
            </div>

            <div className="rounded-xl border border-line bg-surface p-6">
              <ul className="space-y-3 text-[14.5px] text-ink-soft">
                <li>
                  <strong className="font-semibold text-ink">Tell it like it is.</strong>{" "}
                  Accurate condition details produce a better first offer. Honesty
                  never costs you a dollar here.
                </li>
                <li>
                  <strong className="font-semibold text-ink">A person reads it.</strong>{" "}
                  Every notice is reviewed by someone here, never priced by a
                  widget.
                </li>
                <li>
                  <strong className="font-semibold text-ink">Your call, either way.</strong>{" "}
                  You get a clear offer and the freedom to take it or leave it.
                </li>
              </ul>
              <p className="mt-4 flex items-start gap-2 text-[13px] leading-relaxed text-ink-soft">
                <Lock className="mt-0.5 size-4 shrink-0 text-gold-strong" aria-hidden />
                Your contact information is used only to give you a vehicle offer —
                never sold or shared.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
