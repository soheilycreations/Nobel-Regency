import { Room } from "@/types";

export const HOTEL = {
  name: "Nobel Regency Hotel",
  location: "Bibile, Sri Lanka",
  shortAddress: "11 Mahiyangana Road, Bibile 90015, Sri Lanka",
  whatsappNumber: "94723600056",
  facebookUrl: "https://web.facebook.com/nobelregency",
  bookingComUrl: "https://www.booking.com/hotel/lk/nobel-regency.en-gb.html",
  googleMapsUrl: "https://share.google/dnRpSg6brjznTCE6k",
  checkInFrom: "3:00 PM",
  checkOutBy: "9:00 AM",
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
  // Maduru Oya and Dunhinda Falls distances are from the property's own
  // Booking.com listing. Bibile Bubula and Mahiyangana are from general web
  // sources, not the property listing itself — worth double-checking.
  nearbyAttractions: [
    { name: "Maduru Oya National Park", distanceKm: 46 },
    { name: "Dunhinda Falls", distanceKm: 24 },
    { name: "Bibile Bubula Natural Springs", distanceKm: 3 },
    { name: "Mahiyangana Raja Maha Vihara", distanceKm: 39 },
  ],
};

export const ROOMS: Room[] = [
  {
    slug: "double-room-garden-view",
    name: "Double Room with Garden View",
    location: "Main Bungalow",
    tagline: "A compact double room with a private terrace over the garden",
    description:
      "A double room with a terrace looking over the garden, and a private bathroom with a shower. Available with or without air conditioning.",
    pricePerNight: 9500,
    acSurchargePerNight: 1500,
    hasACOption: true,
    currency: "LKR",
    maxGuests: 3,
    sizeSqm: 11,
    bedType: "1 Bed",
    totalUnits: 4,
    images: [
      "/photos/bungalow-veranda-antiques-gym.jpg",
      "/photos/garden-path-flowers.jpg",
      "/photos/rustic-garden-seating.jpg",
    ],
    amenities: ["Garden view", "Private terrace", "Private bathroom with shower", "Dining area", "Electric kettle", "Free WiFi"],
    featured: true,
  },
  {
    slug: "family-room-garden-view",
    name: "Family Room with Garden View",
    location: "Main Bungalow",
    tagline: "A larger room for families, with a bath, TV, and garden views",
    description:
      "A family room with a bath and shower, hairdryer, flat-screen TV, dining area, and wardrobe, looking out over the garden. Available with or without air conditioning.",
    pricePerNight: 13500,
    acSurchargePerNight: 2000,
    hasACOption: true,
    currency: "LKR",
    maxGuests: 7,
    sizeSqm: 21,
    bedType: "2 Beds",
    totalUnits: 1,
    images: [
      "/photos/bungalow-veranda-antiques-gym.jpg",
      "/photos/breakfast-spread-overhead.jpg",
      "/photos/garden-path-flowers.jpg",
    ],
    amenities: ["Garden view", "Bath & shower", "Hairdryer", "Flat-screen TV", "Dining area", "Wardrobe", "Electric kettle", "Free WiFi"],
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

export function getRoomBySlug(slug: string): Room | undefined {
  return ROOMS.find((r) => r.slug === slug);
}
