import { Room, Testimonial } from "@/types";

export const HOTEL = {
  name: "Nobel Regency Luxury Suite",
  location: "Kalutara, Sri Lanka",
  shortAddress: "Galle Road, Kalutara South, Sri Lanka",
  whatsappNumber: "94770000000", // TODO: replace with real hotel WhatsApp number
  coordinates: { lat: 6.5854, lng: 79.9607 },
  seoKeywords: [
    "best hotel in Kalutara",
    "luxury hotel Kalutara beach",
    "5 star hotel Kalutara Sri Lanka",
    "boutique hotel near Kalutara Bodhiya",
  ],
  nearbyAttractions: [
    { name: "Kalutara Bodhiya", distanceKm: 1.2 },
    { name: "Richmond Castle", distanceKm: 3.5 },
    { name: "Kalutara Beach", distanceKm: 0.6 },
    { name: "Maha Kalutara River Safari", distanceKm: 4.1 },
  ],
};

export const ROOMS: Room[] = [
  {
    slug: "regency-ocean-suite",
    name: "Regency Ocean Suite",
    tagline: "Uninterrupted Indian Ocean views from a private balcony",
    description:
      "Our signature suite pairs sweeping ocean views with hand-finished gold detailing, a king-size four-poster bed, and a marble en-suite bathroom. Wake up to the sound of the Kalutara shoreline.",
    pricePerNight: 42000,
    currency: "LKR",
    maxGuests: 2,
    sizeSqm: 48,
    bedType: "King",
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1600",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1600",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1600",
    ],
    amenities: ["Private balcony", "Ocean view", "King bed", "Rain shower", "Minibar", "Free WiFi"],
    featured: true,
  },
  {
    slug: "heritage-garden-room",
    name: "Heritage Garden Room",
    tagline: "A quiet retreat framed by tropical gardens",
    description:
      "Set around a courtyard of frangipani and palm, the Heritage Garden Room is designed for slow mornings — a reading nook, a private patio, and soft charcoal-and-gold interiors throughout.",
    pricePerNight: 28000,
    currency: "LKR",
    maxGuests: 2,
    sizeSqm: 36,
    bedType: "Queen",
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1600",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600",
    ],
    amenities: ["Garden view", "Private patio", "Queen bed", "Free WiFi", "Rain shower"],
  },
  {
    slug: "presidential-gold-suite",
    name: "Presidential Gold Suite",
    tagline: "The Regency's most exclusive address",
    description:
      "A full-floor suite with a private plunge pool, dedicated butler service, and a living area finished in polished gold and dark timber. Reserved for guests who expect nothing less than the best.",
    pricePerNight: 95000,
    currency: "LKR",
    maxGuests: 4,
    sizeSqm: 110,
    bedType: "King + Twin",
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1600",
    ],
    amenities: ["Private plunge pool", "Butler service", "Ocean view", "Living room", "Free WiFi", "Minibar"],
    featured: true,
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Anke Weber",
    country: "Germany",
    quote:
      "Every detail felt considered, from the welcome drink to the turndown service. The Ocean Suite view alone is worth the trip to Kalutara.",
    rating: 5,
  },
  {
    name: "Ruwan Perera",
    country: "Sri Lanka",
    quote:
      "Booked the Presidential Gold Suite for our anniversary. Quiet, private, and the staff anticipated everything we needed.",
    rating: 5,
  },
  {
    name: "Charlotte Byrne",
    country: "United Kingdom",
    quote:
      "The garden rooms are a hidden gem — peaceful, beautifully designed, and five minutes from the beach.",
    rating: 5,
  },
];

export function getRoomBySlug(slug: string): Room | undefined {
  return ROOMS.find((r) => r.slug === slug);
}
