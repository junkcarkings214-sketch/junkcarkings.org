import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/site/hero";
import { OfferStart } from "@/components/site/offer-start";
import { WhatWeBuy } from "@/components/site/what-we-buy";
import { HowItWorks } from "@/components/site/how-it-works";
import { WhyChooseUs } from "@/components/site/why-choose-us";
import { SubmitCta } from "@/components/site/cta-banner";
import { Faq } from "@/components/site/faq";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <OfferStart />
        <WhatWeBuy />
        <HowItWorks />
        <WhyChooseUs />
        {/* Testimonials stay unpublished until genuine customer reviews exist
            (the current component content is invented placeholder material —
            see TODO.md Phase 7). */}
        <SubmitCta />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
