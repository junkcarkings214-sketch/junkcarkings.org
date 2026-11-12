import Link from "next/link";
import { cacheLife } from "next/cache";
import { Phone, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { navLinks, siteConfig } from "@/lib/site";

/**
 * Copyright year is computed once and cached so the prerendered shell stays
 * stable (Cache Components forbids unstable Date.now/new Date at prerender).
 */
async function copyrightYear(): Promise<number> {
  "use cache";
  cacheLife("max");
  return new Date().getFullYear();
}

export async function Footer() {
  const year = await copyrightYear();

  return (
    <footer className="mt-auto bg-mist">
      <div className="shell py-14">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr] md:gap-12">
          <div>
            <Logo className="h-11 w-auto" />
            <p className="mt-4 max-w-[36ch] text-[15px] leading-relaxed text-ink-soft">
              A locally focused buyer serving {siteConfig.serviceArea}. Tell us
              about the vehicle and a real person gets back to you with an offer.
            </p>
            <p className="mt-4 text-[13px] text-ink-soft">
              Free evaluation. No obligation. No account.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="text-[13px] font-semibold tracking-[0.14em] uppercase text-ink-soft">
              Pages
            </h2>
            <ul className="mt-3 text-[15px]">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="-mx-1 inline-block rounded px-1 py-2 text-ink transition-colors hover:text-navy-800 hover:underline hover:underline-offset-4"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[13px] font-semibold tracking-[0.14em] uppercase text-ink-soft">
              Get in touch
            </h2>
            <ul className="mt-3 text-[15px] text-ink">
              <li>
                <a
                  href={siteConfig.phoneHref}
                  className="-mx-1 inline-flex items-center gap-2 rounded px-1 py-2 font-semibold tabular-nums hover:text-navy-800"
                >
                  <Phone className="size-4 text-gold-strong" aria-hidden />
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="-mx-1 inline-flex items-center gap-2 rounded px-1 py-2 break-all hover:text-navy-800"
                >
                  <Mail className="size-4 shrink-0 text-gold-strong" aria-hidden />
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-center gap-2 px-1 py-2 text-ink-soft">
                <MapPin className="size-4 shrink-0 text-gold-strong" aria-hidden />
                {siteConfig.serviceArea}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-5 text-[12.5px] text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name} ({siteConfig.domain}). All rights reserved.
          </p>
          <p>
            Junkyard photograph by CGP Grey, licensed CC BY 2.0.
          </p>
        </div>
      </div>
    </footer>
  );
}
