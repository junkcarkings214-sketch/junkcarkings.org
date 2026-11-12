"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Logo } from "@/components/site/logo";
import { navLinks, siteConfig } from "@/lib/site";
import { cn } from "cn";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="shell flex h-16 items-center gap-3 sm:h-[76px]">
        <Link
          href="/"
          className="flex shrink-0 items-center rounded-md"
          aria-label={`${siteConfig.name} home`}
        >
          <Logo priority className="h-10 w-auto sm:h-11 lg:h-12" />
        </Link>

        <nav
          aria-label="Main navigation"
          className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 lg:flex"
        >
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex items-center rounded-xl px-3.5 py-2.5 text-[15px] font-medium text-ink-soft transition-[background-color,color] duration-200 hover:bg-sand hover:text-ink",
                  active && "bg-sand font-semibold text-ink"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Button asChild size="lg" className="hidden md:inline-flex">
            <a href={siteConfig.phoneHref}>
              <Phone className="size-4 text-gold" aria-hidden />
              {siteConfig.phone}
            </a>
          </Button>

          <a
            href={siteConfig.phoneHref}
            aria-label={`Call ${siteConfig.name} at ${siteConfig.phone}`}
            className="flex size-11 items-center justify-center rounded-lg text-ink md:hidden"
          >
            <Phone className="size-5" aria-hidden />
          </a>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon-lg"
                className="lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-paper p-0 text-ink">
              <SheetHeader className="border-b border-line px-5 py-4 text-left">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <Logo className="h-9" />
              </SheetHeader>
              <nav aria-label="Mobile navigation" className="flex flex-col p-4">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="border-b border-line py-4 text-lg font-medium text-ink"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Button asChild size="lg" className="mt-5 w-full">
                    <a href={siteConfig.phoneHref}>
                      <Phone className="size-4 text-gold" aria-hidden />
                      {siteConfig.phone}
                    </a>
                  </Button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
