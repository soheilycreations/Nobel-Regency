import { Room, Testimonial } from "@/types";

export const HOTEL = {
  name: "Nobel Regency Hotel",
  location: "Bibile, Sri Lanka",
  shortAddress: "11 Mahiyangana Road, Bibile 90015, Sri Lanka",
  whatsappNumber: "94770000000", // TODO: replace with real hotel WhatsApp number
  facebookUrl: "https://web.facebook.com/nobelregency",
  bookingComUrl: "https://www.booking.com/hotel/lk/nobel-regency.en-gb.html",
  // Approximate town-centre coordinates for Bibile, Monaragala District, Uva Province.
  // Swap for the exact property pin once you share it.
  coordinates: { lat: 7.1601, lng: 81.2254 },
  seoKeywords: [
    "Nobel Regency Bibile",
    "best hotel in Bibile",
    "Bibile hotels Sri Lanka",
    "garden bungalow Bibile",
    "Bibile honeymoon hotel",
    "meditation retreat Uva Sri Lanka",
  ],
  // Distances are approximate road distances — worth confirming against the
  // exact property location before publishing.
  nearbyAttractions: [
    { name: "Bibile Bubula Natural Springs", distanceKm: 3 },
    { name: "Maduru Oya National Park", distanceKm: 28 },
    { name: "Mahiyangana Raja Maha Vihara", distanceKm: 39 },
    { name: "Bibile Town Centre", distanceKm: 1 },
  ],
};

export const ROOMS: Room[] = [
  {
    slug: "garden-double-room",
    name: "Garden Double Room",
    location: "Main Bungalow",
    tagline: "A double bedroom surrounded by heritage antiques and garden views",
    description:
      "One of four double bedrooms in the main bungalow, each finished with pieces from the Regency's antique collection and looking out over the 2-acre garden. Book with or without air conditioning.",
    pricePerNight: 9500,
    acSurchargePerNight: 1500,
    hasACOption: true,
    currency: "LKR",
    maxGuests: 2,
    bedType: "Double",
    totalUnits: 4,
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1600",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1600",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=1600",
    ],
    amenities: ["Garden view", "Antique furnishings", "Attached bathroom", "Free WiFi", "Shared sitting area"],
    featured: true,
  },
  {
    slug: "family-bedroom",
    name: "Family Bedroom",
    location: "Main Bungalow",
    tagline: "The bungalow's largest bedroom, built for families",
    description:
      "A spacious family bedroom within the main bungalow, close to the dining area, lobby, and modern kitchen — comfortable for parents travelling with children. Available with or without air conditioning.",
    pricePerNight: 13500,
    acSurchargePerNight: 2000,
    hasACOption: true,
    currency: "LKR",
    maxGuests: 4,
    bedType: "Double + Extra beds",
    totalUnits: 1,
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1600",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600",
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=1600",
    ],
    amenities: ["Garden view", "Extra bedding", "Attached bathroom", "Free WiFi", "Near dining area"],
  },
  {
    slug: "cottage-bedroom",
    name: "Cottage Bedroom",
    location: "Family Cottage",
    tagline: "A private bedroom in the separate garden cottage",
    description:
      "One of two bedrooms in the Regency's separate family cottage, which also has its own living area and kitchen. A quiet option for couples or small families who'd like a bit more privacy from the main bungalow. Available with or without air conditioning.",
    pricePerNight: 11000,
    acSurchargePerNight: 1500,
    hasACOption: true,
    currency: "LKR",
    maxGuests: 2,
    bedType: "Double",
    totalUnits: 2,
    images: [
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=1600",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1600",
    ],
    amenities: ["Shared living area", "Shared kitchen access", "Garden view", "Free WiFi"],
  },
  {
    slug: "meditation-retreat-cottage",
    name: "Meditation Retreat Cottage",
    location: "15-Acre Retreat Grounds",
    tagline: "A standalone cottage set in 15 acres of quiet green land",
    description:
      "For guests visiting for meditation or a genuine break from noise, this standalone cottage sits within the Regency's own 15-acre grounds, away from the main bungalow. Simple, quiet, and close to nature.",
    pricePerNight: 8500,
    hasACOption: false,
    currency: "LKR",
    maxGuests: 2,
    bedType: "Double",
    totalUnits: 1,
    images: [
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1600",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1600",
      "https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80&w=1600",
    ],
    amenities: ["15-acre private grounds", "Meditation space", "Nature views", "Peaceful, no road noise"],
    featured: true,
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Nadeesha Gunawardena",
    country: "Sri Lanka",
    quote:
      "Booked the family cottage for a weekend away from Colombo. The garden and the antiques everywhere give it a character you don't get in a normal hotel.",
    rating: 5,
  },
  {
    name: "Marco Bianchi",
    country: "Italy",
    quote:
      "Stayed at the retreat cottage for four nights to meditate and disconnect. Fifteen acres of complete quiet — exactly what I needed.",
    rating: 5,
  },
  {
    name: "Kavindi & Ruwan",
    country: "Sri Lanka",
    quote:
      "Had our engagement photoshoot in the garden. The staff let us use the grounds all afternoon and the organic food afterward was excellent.",
    rating: 5,
  },
];

export function getRoomBySlug(slug: string): Room | undefined {
  return ROOMS.find((r) => r.slug === slug);
}
