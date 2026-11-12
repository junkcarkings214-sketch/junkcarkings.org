import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import { siteConfig } from "@/lib/site";
import "./globals.css";

/**
 * Figtree carries reading copy: open, friendly, clear on a phone outdoors.
 */
const figtree = Figtree({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Bricolage Grotesque gives headlines a human, slightly characterful voice
 * while staying sturdy and trustworthy at large sizes.
 */
const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: "variable",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | We Buy Junk Cars, Trucks & More`,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "Sell your junk car without the hassle. Tell us about your vehicle, add photos, and a real person from Junk Car Kings gets back to you with an offer. Free evaluation, no obligation.",
  keywords: [
    "junk car pickup",
    "sell junk car",
    "cash for cars",
    "junk car removal",
    "sell my car for cash",
    "vehicle buying service",
  ],
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | We Buy Junk Cars, Trucks & More`,
    description:
      "Free evaluation, no obligation. Tell us about your vehicle and a real person gets back to you with an offer.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
