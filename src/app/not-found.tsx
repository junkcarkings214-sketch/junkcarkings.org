import Link from "next/link";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 items-center bg-paper py-16 sm:py-24">
        <div className="shell">
          <div className="max-w-[54ch]">
            <p className="text-[clamp(4.5rem,14vw,7rem)] leading-[0.8] font-extrabold tracking-[-0.04em] text-ink">
              404
            </p>
            <h1 className="mt-6 text-[clamp(1.9rem,3.6vw,2.75rem)] leading-[1.05] font-extrabold text-ink">
              We could not find that page.
            </h1>
            <p className="mt-3 text-[16.5px] leading-relaxed text-ink-soft">
              It may have moved, or the link may be out of date. Nothing is lost —
              the offer form and the phone number are both right here.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/">Back to home</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/sell-your-car">Get an offer</Link>
              </Button>
            </div>

            <p className="mt-6 text-[14px] text-ink-soft">
              Or call{" "}
              <a
                href={siteConfig.phoneHref}
                className="font-semibold text-ink underline decoration-gold decoration-2 underline-offset-4"
              >
                {siteConfig.phone}
              </a>{" "}
              and a person will help.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
