---
name: Junk Car Kings
description: A warm, human-first vehicle-buying site for Junk Car Kings — navy and gold on soft linen, rounded and gentle, built around a real person answering.
colors:
  porch-navy: "#0c1d47"
  midnight-navy: "#081430"
  brand-navy-light: "#1a3370"
  morning-gold: "#f2b320"
  morning-gold-deep: "#c98a06"
  linen-paper: "#fbf7f1"
  sheet-white: "#ffffff"
  sand-drift: "#f4ede2"
  mist-band: "#f1eadf"
  quiet-slate: "#55607a"
  ink-line: "#e8dfd1"
  alert-red: "#b3261e"
typography:
  display:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 5.8vw, 4.6rem)"
    fontWeight: 700
    lineHeight: "1.02"
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 3.4vw, 2.75rem)"
    fontWeight: 700
    lineHeight: "1.05"
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: "1.25"
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: "1.65"
    letterSpacing: "0em"
  label:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: "1.4"
    letterSpacing: "0.02em"
rounded:
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "26px"
  "2xl": "32px"
spacing:
  gutter: "20px / 32px / 40px (mobile / sm / lg)"
  section-y: "56px / 80px (mobile / desktop)"
  stack-tight: "8px"
  stack-mid: "20px"
  stack-loose: "32px"
components:
  button-primary:
    backgroundColor: "{colors.porch-navy}"
    textColor: "#ffffff"
    rounded: "{rounded.xl}"
    padding: "0 32px"
    height: "56px"
  button-gold:
    backgroundColor: "{colors.morning-gold}"
    textColor: "{colors.porch-navy}"
    rounded: "{rounded.xl}"
    padding: "0 32px"
    height: "56px"
  button-outline:
    backgroundColor: "{colors.sheet-white}"
    textColor: "{colors.porch-navy}"
    rounded: "{rounded.xl}"
    padding: "0 24px"
    height: "48px"
  field-input:
    backgroundColor: "{colors.linen-paper}"
    textColor: "{colors.porch-navy}"
    rounded: "{rounded.md}"
    height: "48px"
  form-panel:
    backgroundColor: "{colors.sheet-white}"
    textColor: "{colors.porch-navy}"
    rounded: "{rounded.2xl}"
    padding: "20px / 32px"
---

# Design System: Junk Car Kings

## Overview

**Creative North Star: "The Warm Porch"**

This is a site a worried owner can call from a driveway in daylight. It behaves like
a neighbour's porch: soft edges, warm ground, navy ink spoken in a calm voice, and
one gold hand offered in greeting. Never a poster, never a widget wall — the
design's whole job is to make handing over the vehicle's details feel safe.

Two truths shape everything. First, the visitor is often outside, one-handed, in
sun: type stays weighty, controls stay large, contrast never leans on subtlety.
Second, the product promise is a person, not an algorithm: the interface keeps
human timing — soft cushions, gentle lifts, one unhurried action per region —
instead of the sharp, stamped, mechanical look the category usually reaches for.

**Key Characteristics:**
- Warm linen ground; pure white appears only inside cards.
- Navy does the talking, gold does the greeting.
- Everything rounds; nothing shouts.
- One primary action per region, always plainly visible.
- Soft diffuse shadows only; hard offset blocks never appear.

## Colors

The palette reads as warm paper under navy ink with a gold lamp beside the chair.

### Primary
- **Deep Porch Navy** (#0c1d47): all headings, body text at full strength, primary
  buttons, dark statement bands. It carries the voice, not decoration.
- **Midnight Navy** (#081430): the darkest band color (hero wash ground, navy
  panels) and the tint for photo overlays.

### Secondary
- **Morning Gold** (#f2b320): the one action on each region — CTAs, small icon
  accents, focus-checked marks — over both light and navy grounds.
- **Morning Gold Deep** (#c98a06): gold's darker hover step on light surfaces.

### Tertiary
- **Brand Navy Light** (#1a3370): navy's hover step inside dark panels.

### Neutral
- **Linen Paper** (#fbf7f1): the page ground; warm, never pure white.
- **Sheet White** (#ffffff): cards, panels, and form fields.
- **Sand Drift** (#f4ede2): soft filled areas — secondary buttons, quiet blocks.
- **Mist Band** (#f1eadf): full-width neutral section bands.
- **Quiet Slate** (#55607a): secondary reading text; tinted from navy, never gray.
- **Ink Line** (#e8dfd1): hairline borders and dividers on warm ground.
- **Alert Red** (#b3261e): form errors only; reserved there and nowhere else.

### Named Rules
**The Porch Light Rule.** Gold appears once per region: a single action or a small
set of icons. It marks the door, so it is never used for two competing actions.
**The Tinted-Not-Gray Rule.** Secondary text tints from navy (#55607a) and reads
AA on linen. Any flat neutral gray on the warm ground is wrong.

## Typography

**Display Font:** Bricolage Grotesque (system-ui fallback)
**Body Font:** Figtree (system-ui fallback)

**Character:** Bricolage gives headlines a hand-set warmth — a friend talking,
still clearly in charge. Figtree answers with an open, unhurried voice that
behaves at small sizes and long measures on a phone outdoors.

### Hierarchy
- **Display** (700, clamp(2.6rem, 5.8vw, 4.6rem), line-height 1.02, tracking
  -0.03em): the hero headline only. One per page.
- **Headline** (700, clamp(1.9rem, 3.4vw, 2.75rem), line-height 1.05): section
  headings.
- **Title** (700, 1.25rem, line-height 1.25): cards, steps, list items.
- **Body** (400, 17–19px hero / 14.5–15.5px cards, line-height 1.65): reading
  copy held to a 46–62ch measure.
- **Label** (600, 13–14.5px): field labels, meta rows, six-character tracked
  caps only for the local-area line.

### Named Rules
**The Calm Voice Rule.** Headlines bind in sentence case with soft tracking.
Never condensed capitals, never tracked display type — the page stays human.

## Layout

A single centered 1200px shell with 20px (phone), 32px (sm), and 40px (lg) side
gutters. Sections breathe at 56px of vertical room on phones and 80px on desktop,
always more space above a heading than below. Text columns hold 3–4 items per
line at any size. The hero is full-bleed; every later section is an aligned row
of one or two columns, and the offer panel overlaps the hero's bottom edge by
32px so the conversion step physically steps forward.

## Elevation & Depth

Depth is drawn with light, not walls: a faint contact shadow plus a diffuse warm
lift at roughly -22px spread, and nothing harder. Surfaces that float (offer
panel, primary buttons) carry it; bands and section grounds stay flat.

### Shadow Vocabulary
- **Soft lift** (`box-shadow: 0 1px 2px rgba(12,29,71,0.05), 0 18px 40px -22px
  rgba(12,29,71,0.28)`): the resting shadow of the offer panel and cards.
- **Button glow** (`box-shadow: 0 8px 18px -10px rgba(12,29,71,0.6)` navy;
  `rgba(201,138,6,0.8)` gold): light contact shadow under primary actions only.

### Named Rules
**The Soft Shadow Rule.** Every shadow has a real blur and a small negative
spread; a hard offset block `4px 4px 0` or any zero-blur halo never ships here.

## Shapes

A rounded world with a single radius root of 20px: cards at 32px, primary
buttons at 26px, fields and inner blocks at 12–16px. Nothing is rectangular.
The edge language is a warm 1px `Ink Line` border plus the lift shadow — the
combination reads as paper with weight, not plastic.

## Components

### Buttons
- **Shape:** 26px radius, 56px tall for primary/gold, 48px for supporting ones.
- **Primary:** Deep Porch Navy fill, white text, glowing contact shadow, hover to
  Brand Navy Light with a 1px settle.
- **Gold:** Morning Gold fill with Deep Porch Navy text on the one action per
  region; hover lightens gold, never darkens past legibility on navy.
- **Secondary / Ghost:** Sheet White or transparent with the Ink Line border;
  hover fills with Sand Drift.

### Cards / Containers
- **Corner Style:** 32px.
- **Background:** Sheet White over the linen page; Mist or Sand bands sit behind
  them, never a nested card inside a card.
- **Shadow Strategy:** the soft lift at rest.
- **Internal Padding:** 20px phone, 32px desktop.

### Inputs / Fields
- **Style:** 12px radius, 48px tall, Ink Line border on Linen Paper, 16px fill.
- **Focus:** border shifts to Deep Porch Navy with the page-visible navy focus
  ring; no glow.

### Navigation
- A single sticky bar, hairline bottom border, gold underline for the active
  page. Mobile folds into a quiet right-side sheet; the phone number stays
  one thumb-reach away.

## Do's and Don'ts

### Do:
- **Do** keep the page ground warm (#fbf7f1); pure white appears only inside
  cards and panels.
- **Do** place the gold action once per region and give it 50%+ weight in focus.
- **Do** round every corner; the radius ladder is 12/16/20/26/32px and unstated
  values default upward.
- **Do** set photography with a navy wash strong enough that white type at 4.5:1
  minimum is guaranteed where words land.

### Don't:
- **Don't** ship a kicker or eyebrow over any heading; the heading carries its
  own weight.
- **Don't** use hard offset or stamp shadows, gradient text, glass, or condensed
  caps — the porch reads calm, not mechanical.
- **Don't** add stat counters, rating badges, or review gadgets; the trust story
  is the human review, plain words and the phone.
