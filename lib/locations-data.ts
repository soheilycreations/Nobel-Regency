import { Location } from "@/types";

// Real, well-sourced regional details (see conversation history for how
// these were verified), now structured as a proper admin-manageable content
// type rather than a hardcoded list — each gets its own page for SEO, and
// can be edited/added to directly in /admin/locations without touching code.
export const LOCATIONS: Location[] = [
  {
    slug: "maduru-oya-national-park",
    name: "Maduru Oya National Park",
    tagline: "A jeep safari through one of Sri Lanka's larger national parks",
    description:
      "Maduru Oya National Park is about 46 km from Nobel Regency Hotel, home to elephants, deer, and a wide range of birdlife. A good option for guests who want a traditional jeep safari experience.",
    distanceLabel: "46 km from the hotel",
    images: ["/photos/banana-leaf-couple.jpg"],
    highlights: ["Elephants and diverse wildlife", "Jeep safari", "Half-day trip"],
    featured: true,
  },
  {
    slug: "dunhinda-falls",
    name: "Dunhinda Falls",
    tagline: "One of Sri Lanka's best-known waterfalls",
    description:
      "Dunhinda Falls, roughly 24 km from the hotel, is one of the most-visited waterfalls in Sri Lanka, reached via a short forest walk from the car park. Pairs well with a stop in Mahiyangana on the way.",
    distanceLabel: "24 km from the hotel",
    images: ["/photos/rustic-garden-seating.jpg"],
    highlights: ["Short forest walk to the falls", "Can be combined with Mahiyangana", "Good for all fitness levels"],
    featured: true,
  },
  {
    slug: "bibile-bubula-natural-springs",
    name: "Bibile Bubula Natural Springs",
    tagline: "A natural spring right in Bibile town",
    description:
      "Bibile Bubula is a natural spring a few kilometres from the hotel, a quiet, local spot rather than a tourist attraction — worth a stop if you're exploring Bibile itself.",
    distanceLabel: "~3 km from the hotel",
    images: ["/photos/garden-path-flowers.jpg"],
    highlights: ["Natural spring", "Close to town centre"],
  },
  {
    slug: "mahiyangana-raja-maha-vihara",
    name: "Mahiyangana Raja Maha Vihara",
    tagline: "One of Sri Lanka's most sacred Buddhist temples",
    description:
      "Mahiyangana Raja Maha Vihara, about 39 km from the hotel, is one of the sixteen most sacred Buddhist sites in Sri Lanka (Solosmasthana), said to mark the Buddha's first visit to the island.",
    distanceLabel: "39 km from the hotel",
    images: ["/photos/garden-sunflare.jpg"],
    highlights: ["Sacred Buddhist site", "Historic architecture", "Combine with Dunhinda Falls"],
  },
];

export function getLocationBySlug(slug: string): Location | undefined {
  return LOCATIONS.find((l) => l.slug === slug);
}
