import { Room, Testimonial } from "@/types";

export const HOTEL = {
  name: "Nobel Regency Hotel",
  location: "Bibile, Sri Lanka",
  shortAddress: "11 Mahiyangana Road, Bibile 90015, Sri Lanka",
  whatsappNumber: "94723600056",
  facebookUrl: "https://web.facebook.com/nobelregency",
  bookingComUrl: "https://www.booking.com/hotel/lk/nobel-regency.en-gb.html",
  googleMapsUrl: "https://share.google/dnRpSg6brjznTCE6k",
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
      "/photos/bungalow-veranda-antiques-gym.jpg",
      "/photos/garden-path-flowers.jpg",
      "/photos/rustic-garden-seating.jpg",
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
      "/photos/bungalow-veranda-antiques-gym.jpg",
      "/photos/breakfast-spread-overhead.jpg",
      "/photos/garden-path-flowers.jpg",
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
      "/photos/cottage-veranda-couple.jpg",
      "/photos/banana-leaf-couple.jpg",
      "/photos/garden-sunflare.jpg",
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
      "/photos/rustic-garden-seating.jpg",
      "/photos/banana-leaf-couple.jpg",
      "/photos/garden-path-flowers.jpg",
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
