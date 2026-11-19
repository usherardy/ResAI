import { Marquee } from "@/components/ui/marquee";

/*
 * Where Wispr Flow shows a logo wall, ResAI (pre-launch, no customers to
 * claim) shows the kinds of places it's built for.
 */

const placeTypes = [
  "Pizzerias",
  "Cafés",
  "Taquerias",
  "Bakeries",
  "Wine bars",
  "Food trucks",
  "Ramen shops",
  "Brunch spots",
  "Breweries",
  "Delis",
  "Burger joints",
  "Coffee carts",
];

export function BuiltFor() {
  return (
    <section aria-labelledby="built-for-title" className="py-12 sm:py-16">
      <p id="built-for-title" className="text-center text-sm text-muted-foreground">
        Built for independent
      </p>
      <Marquee
        listLabel="Kinds of restaurants ResAI is built for"
        pauseOnHover
        repeat={3}
        className="mt-5 [--duration:50s] [--gap:0.75rem] [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] motion-reduce:[mask-image:none] motion-reduce:px-5"
      >
        {placeTypes.map((place) => (
          <span
            key={place}
            role="listitem"
            className="shrink-0 rounded-full border border-foreground/10 bg-white/70 px-5 py-2.5 text-[17px] font-[family-name:var(--font-serif-b)] tracking-[-0.005em] text-foreground/85 italic"
          >
            {place}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
