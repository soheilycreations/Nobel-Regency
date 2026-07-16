import { Tour } from "@/types";

// "Gal Oya Experience Package" is a real, confirmed tour package — name and
// core description (nature attractions, local culture, sightseeing support)
// given directly; enriched with well-sourced public details about the park
// itself (location, reservoir, swimming elephants). Exact pricing/schedule
// still need to come from you. Dunhinda Falls and Maduru Oya Safari below
// are still placeholders — real, well-documented regional activities, but
// without confirmed pricing/timing from the property yet. All of this is
// fallback/seed content; once tours exist in Supabase, the admin-managed
// versions take priority (see lib/supabase.ts::getTours).
export const TOURS: Tour[] = [
  {
    slug: "gal-oya-experience-package",
    name: "Gal Oya Experience Package",
    tagline: "Sri Lanka's only boat safari — elephants swimming between islands",
    description:
      "Gal Oya National Park, near Inginiyagala, is the one national park in Sri Lanka where safaris happen by boat rather than jeep. On the Senanayake Samudra reservoir, guides watch for elephants swimming between islands, alongside crocodiles, deer, and rich birdlife — sightings are best in the dry season (roughly March–September) when water levels drop and animals gather near the shore. The area is also home to the Vedda, Sri Lanka's indigenous forest-dwelling community. Boat safaris are booked through the Gal Oya Wildlife Department office in Inginiyagala; we arrange this directly for guests, along with the local culture and sightseeing elements of the package.",
    durationLabel: "Half day (boat safari typically ~2 hours)",
    priceLabel: "Contact for pricing",
    images: ["/photos/garden-sunflare.jpg"],
    highlights: ["Boat safari on Senanayake Samudra reservoir", "Chance to see swimming elephants", "Vedda indigenous community nearby", "Sightseeing support arranged by the hotel"],
    featured: true,
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
      "A jeep safari through Maduru Oya National Park, home to elephants, deer, and a wide range of birdlife. A good alternative for guests who want a more traditional jeep safari experience.",
    durationLabel: "Half day",
    priceLabel: "Contact for pricing",
    images: ["/photos/banana-leaf-couple.jpg"],
    highlights: ["Jeep safari", "Elephants and diverse wildlife", "Experienced local guides"],
  },
];

export function getTourBySlug(slug: string): Tour | undefined {
  return TOURS.find((t) => t.slug === slug);
}
