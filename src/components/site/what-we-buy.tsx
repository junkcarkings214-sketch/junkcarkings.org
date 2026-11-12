import { CarFront, Truck, Caravan, Tractor } from "lucide-react";

const vehicles = [
  {
    icon: CarFront,
    title: "Cars & sedans",
    copy: "The commuter that finally quit, or the project that never started.",
  },
  {
    icon: Truck,
    title: "Trucks & SUVs",
    copy: "Work trucks, old pickups, family SUVs — high miles are fine.",
  },
  {
    icon: Caravan,
    title: "Vans & fleet",
    copy: "Cargo vans, passenger vans, and small business vehicles.",
  },
  {
    icon: Tractor,
    title: "Wrecked or not running",
    copy: "Collision damage, rust, blown motor, no title in hand? Ask anyway.",
  },
];

export function WhatWeBuy() {
  return (
    <section aria-labelledby="what-we-buy-heading" className="bg-paper">
      <div className="shell py-14 sm:py-20">
        <div className="max-w-[60ch]">
          <h2
            id="what-we-buy-heading"
            className="mt-0 text-[clamp(1.9rem,3.4vw,2.75rem)] leading-[1.05] font-extrabold text-ink"
          >
            If it has four wheels and a story, ask.
          </h2>
          <p className="mt-4 max-w-[56ch] text-[16.5px] leading-relaxed text-ink-soft">
            Junk Car Kings buys unwanted vehicles across Central and North Texas.
            Any condition, any reason — it does not have to run, and it does not
            have to be pretty.
          </p>
        </div>

        <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {vehicles.map((vehicle) => (
            <li key={vehicle.title} className="border-t border-line pt-5">
              <vehicle.icon className="size-6 text-gold-strong" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-ink">{vehicle.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">
                {vehicle.copy}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
