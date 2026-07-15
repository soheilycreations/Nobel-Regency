import { Tour } from "@/types";

// Placeholder pricing/durations — these are real, well-documented activities
// in the region (confirmed via independent travel sources), but exact
// pricing, timing, and operator arrangements need to come from you before
// publishing. This is fallback/seed content; once tours exist in Supabase,
// the admin-managed versions take priority (see lib/supabase.ts::getTours).
export const TOURS: Tour[] = [
  {
    slug: "gal-oya-boat-safari",
    name: "Gal Oya Boat Safari",
    tagline: "Sri Lanka's only lake safari — elephants swimming between islands",
    description:
      "Gal Oya National Park is the one place in Sri Lanka where safaris happen by boat rather than jeep. On the Senanayake Samudra reservoir, guides look for elephants swimming between islands, along with crocodiles and birdlife. Best during the dry season (March–September) when water levels drop and animals gather near the shore.",
    durationLabel: "Half day",
    priceLabel: "Contact for pricing",
    images: ["/photos/garden-sunflare.jpg"],
    highlights: ["Boat safari on Senanayake Samudra", "Chance to see swimming elephants", "Birdlife and crocodiles"],
    featured: true,
  },
  {
    slug: "vedda-village-walk",
    name: "Vedda Indigenous Village Walk",
    tagline: "A guided walk with Sri Lanka's indigenous forest-dwelling community",
    description:
      "Near Gal Oya, guided walks with the Vedda community offer a look at customs and traditions that go back generations — how they read the forest, their relationship with the land, and a way of life still practiced today. Arranged respectfully and directly with the community.",
    durationLabel: "2-3 hours",
    priceLabel: "Contact for pricing",
    images: ["/photos/garden-path-flowers.jpg"],
    highlights: ["Guided by the local community", "Traditional customs and forest knowledge", "A respectful, small-group experience"],
  },
  {
    slug: "dunhinda-falls-day-trip",
    name: "Dunhinda Falls Day Trip",
    tagline: "One of Sri Lanka's best-known waterfalls, a short drive away",
    description:
      "Dunhinda Falls is one of the most-visited waterfalls in Sri Lanka, reached via a short forest walk from the car park. A relaxed half-day trip that pairs well with a stop in Mahiyangana.",
    durationLabel: "Half day",
    priceLabel: "Contact for pricing",
    images: ["/photos/rustic-garden-seating.jpg"],
    highlights: ["Short forest walk to the falls", "Can be combined with Mahiyangana", "Good for all fitness levels"],
  },
  {
    slug: "maduru-oya-safari",
    name: "Maduru Oya National Park Safari",
    tagline: "A jeep safari through one of the island's larger national parks",
    description:
      "A jeep safari through Maduru Oya National Park, home to elephants, deer, and a wide range of birdlife. A good alternative for guests who want a more traditional jeep safari experience alongside the boat safari at Gal Oya.",
    durationLabel: "Half day",
    priceLabel: "Contact for pricing",
    images: ["/photos/banana-leaf-couple.jpg"],
    highlights: ["Jeep safari", "Elephants and diverse wildlife", "Experienced local guides"],
  },
];

export function getTourBySlug(slug: string): Tour | undefined {
  return TOURS.find((t) => t.slug === slug);
}
