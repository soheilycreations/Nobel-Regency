export interface Room {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  pricePerNight: number;
  currency: "LKR" | "USD";
  maxGuests: number;
  sizeSqm: number;
  bedType: string;
  images: string[];
  amenities: string[];
  featured?: boolean;
}

export interface BookingRequest {
  roomSlug: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  fullName: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export interface AvailabilityResult {
  available: boolean;
  roomsLeft: number;
}

export interface Testimonial {
  name: string;
  country: string;
  quote: string;
  rating: number;
}
