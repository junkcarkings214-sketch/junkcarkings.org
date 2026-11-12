/**
 * Central business identity for the site.
 * Phone number is taken from the company logo (254-304-1106).
 * Email is the public contact address (contact@junkcarkings.org); owner
 * notification email still sends via the Gmail SMTP account in .env.local.
 */
export const siteConfig = {
  name: "Junk Car Kings",
  domain: "junkcarkings.org",
  url: "https://junkcarkings.org",
  tagline: "We buy junk cars, trucks & more",
  phone: "254-304-1106",
  phoneHref: "tel:+12543041106",
  email: "contact@junkcarkings.org",
  serviceArea: "Central & North Texas",
  foundedNote: "A locally focused vehicle buyer serving Central & North Texas.",
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
  { href: "/sell-your-car", label: "Sell Your Car" },
  { href: "/contact", label: "Contact" },
] as const;
