# Product

<!-- impeccable:product-schema 1 -->

> Provenance note: this file was first drafted in a session whose structured
> question tool had already errored (the interactive surface shut down), so
> unconfirmed facts are labeled **[inferred]**. One earlier session round IS on
> record: the user answered the direction interview live (see
> `.impeccable/surfaces/src-app-page-tsx.md`), pinning the redesign brief
> "human friendly, not robotic, trustworthy, pleasant to the eye, modern but not
> sharp" with confirmed answers: soft and warm; Bricolage Grotesque headlines;
> the junkyard photograph as a full-bleed hero with a navy wash. Those answers
> are user-confirmed, not inferred, and are reflected below.

## Platform

web

## Users

**[inferred]** Primary user: a vehicle owner in Central & North Texas with a car or
truck that has reached the end of its useful life to them — non-running, damaged,
too old, or simply unwanted — who wants it gone and wants cash for it, without the
hassle of dealership trade-ins, private-sale listings, or strangers visiting their
home. Their situation is often time-pressured (a car sitting in the yard, an
insurance write-off, an inherited vehicle). **[inferred from FAQ/form copy and the
junk-car-buyer category; typical, not user-confirmed.]**

Secondary: **[inferred]** someone selling an older but still-running vehicle who
wants a fast, no-listing sale.

## Product Purpose

Junk Car Kings buys junk cars, trucks, and unwanted vehicles across Central &
North Texas. The site's job: convert a visitor into either (a) a submitted vehicle
with photos (the online form) or (b) a phone call. Success = completed submissions
and calls that become offers and pickups.

## Positioning

**[inferred from site copy]** A locally focused, hand-reviewed vehicle buyer: every
submission is reviewed by a real person who contacts the customer directly — not an
instant-algorithm quote bot, not a national call-center lead farm. Free evaluation,
zero obligation. The logo additionally commits the brand to **fast pickup, fair
prices, same day service**.

## Operating Context

- Business runs by phone and text: 254-304-1106 (from the logo; `src/lib/site.ts`).
- Service area: Central & North Texas.
- Vehicle intake is a web form (`/sell-your-car`): year/make/model/mileage/condition
  questions, ZIP, contact info, optional photo uploads. Submissions are stored
  locally (`.data/submissions/`) and emailed to the team (nodemailer).
- An internal admin area (`/admin`) reviews submissions — internal tooling, outside
  the public redesign scope, must keep working.
- Hero photograph: "Utah – North America – Cars – Junk Yard" by CGP Grey, CC BY 2.0
  (attribution in `src/components/site/hero.tsx` — preserve it or replace with an
  equivalently licensed/owned image and note provenance).

## Capabilities and Constraints

- Next.js 16 (App Router, Cache Components), React 19, Tailwind v4, shadcn/ui,
  react-hook-form + zod, pnpm. Deploy target **[inferred]:** Vercel-style Node host.
- Form flow, API routes (`/api/vehicle-submissions`, admin auth, photo serving) and
  email pipeline are working behavior — preserve function and validation exactly.
- Email address `contact@junkcarking.org` is a documented placeholder in
  `src/lib/site.ts` — keep flagged as placeholder, do not present as verified.
- Claims the site may make: free evaluation, no obligation, hand-reviewed offers,
  no account needed. **[inferred — treat as binding until corrected]** Fast pickup /
  fair prices / same day service appear on the logo; use them as brand voice, not as
  new factual guarantees in body copy unless confirmed.

## Brand Commitments

- Name: **Junk Car Kings** (junkcarking.org).
- Logo `public/logo.png` is the binding identity asset: crown motif ("Kings"),
  Texas flag and star, flatbed tow truck carrying a car, chrome/metal lettering,
  palette of red, gold, black and silver, recycling arrows, Dallas skyline
  (Reunion Tower), tagline "WE BUY JUNK CARS, TRUCKS & MORE!", phone banner, and
  the three claims FAST PICKUP ★ FAIR PRICES ★ SAME DAY SERVICE (printed on the
  logo — confirmed brand commitments, not inventions).
- **User-confirmed redesign brief** (recorded decision round): human friendly,
  not robotic, trustworthy, pleasant to the eye, modern but not sharp → the
  committed visual world is **The Warm Porch** (see DESIGN.md): warm linen
  ground, navy ink, one gold action per region, rounded world, Bricolage
  Grotesque display + Figtree body, full-bleed junkyard hero with navy wash.
- **[inferred]** Voice: friendly, plain-spoken, no-pressure — "talk to real people",
  "take it or leave it", "honest answers welcome".

## Evidence on Hand

- `public/logo.png` — full brand lockup (described above).
- `public/hero-junkyard.jpg` — CC BY 2.0 junkyard photo (CGP Grey).
- Existing factual copy across home, `/sell-your-car`, `/contact`, FAQ — verified
  against the form's actual fields and behavior; the substance must survive the
  redesign. No customer testimonials, no pricing data, no city-level service list —
  none may be invented.

## Product Principles

1. **Speed is the promise** — the design must feel as fast as "same day service";
   every screen makes the next action obvious in seconds. **[inferred]**
2. **A real person is on the other end** — prove the hand review; never hide the
   phone number.
3. **Texas-big, honest-small** — carry the logo's road-sign energy without
   overpromising: bold brand, plain facts.
4. **One job per page** — home persuades, `/sell-your-car` collects, `/contact`
   routes. Keep the form's flow and validation untouched.

## Accessibility & Inclusion

- **[inferred]** No product-specific standard was stated; ship WCAG 2.2 AA as the
  working floor — the audience skews toward phone users on the go, some with older
  devices. Keep the incumbent keyboard/focus/reduced-motion care intact.
