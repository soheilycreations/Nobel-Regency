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
    slug: "ac-deluxe-room",
    name: "AC Deluxe Room",
    location: "Main Bungalow",
    tagline: "A comfortable, air-conditioned deluxe room",
    description: "A comfortable air-conditioned deluxe room, suited for 2 guests.",
    pricePerNight: 22,
    hasACOption: false,
    currency: "USD",
    maxGuests: 2,
    bedType: "Double",
    totalUnits: 2,
    images: [
      "/photos/bungalow-veranda-antiques-gym.jpg",
      "/photos/garden-path-flowers.jpg",
      "/photos/rustic-garden-seating.jpg",
    ],
    amenities: ["Air conditioning", "Comfortable stay"],
    featured: true,
  },
  {
    slug: "ac-room",
    name: "AC Room",
    location: "Main Bungalow",
    tagline: "Comfortable air-conditioned accommodation",
    description: "Comfortable air-conditioned accommodation.",
    pricePerNight: 20,
    hasACOption: false,
    currency: "USD",
    maxGuests: 2,
    bedType: "Double",
    totalUnits: 2,
    images: [
      "/photos/bungalow-veranda-antiques-gym.jpg",
      "/photos/breakfast-spread-overhead.jpg",
      "/photos/garden-path-flowers.jpg",
    ],
    amenities: ["Air conditioning"],
  },
  {
    slug: "family-room",
    name: "Family Room",
    location: "Main Bungalow",
    tagline: "Suitable for families, with 4 beds",
    description: "A family room with 4 beds, suitable for families.",
    pricePerNight: 20,
    hasACOption: false,
    currency: "USD",
    maxGuests: 4,
    bedType: "4 Beds",
    totalUnits: 1,
    images: [
      "/photos/bungalow-veranda-antiques-gym.jpg",
      "/photos/breakfast-spread-overhead.jpg",
      "/photos/garden-path-flowers.jpg",
    ],
    amenities: ["Suitable for families"],
  },
  {
    slug: "cabana-nature-stay",
    name: "Cabana Nature Stay",
    location: "Garden Grounds",
    tagline: "A peaceful garden and nature experience",
    description: "A peaceful cabana stay set in the garden, for a nature-focused experience away from the main bungalow.",
    pricePerNight: 32,
    hasACOption: false,
    currency: "USD",
    maxGuests: 2,
    bedType: "Double",
    totalUnits: 1,
    images: [
      "/photos/cottage-veranda-couple.jpg",
      "/photos/rustic-garden-seating.jpg",
      "/photos/banana-leaf-couple.jpg",
    ],
    amenities: ["Garden & nature setting", "Peaceful surroundings"],
    featured: true,
  },
];

export function getRoomBySlug(slug: string): Room | undefined {
  return ROOMS.find((r) => r.slug === slug);
}
