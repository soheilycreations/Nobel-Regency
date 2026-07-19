export interface Room {
  id?: string;
  slug: string;
  name: string;
  location: string;
  tagline: string;
  description: string;
  pricePerNight: number;
  acSurchargePerNight?: number;
  hasACOption: boolean;
  currency: "LKR" | "USD";
  maxGuests: number;
  sizeSqm?: number;
  bedType: string;
  totalUnits: number;
  images: string[];
  amenities: string[];
  featured?: boolean;
}

export interface GalleryPhoto {
  id?: string;
  imageUrl: string;
  caption: string;
  sortOrder?: number;
}

export interface Location {
  id?: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  distanceLabel: string;
  images: string[];
  highlights: string[];
  featured?: boolean;
}

export interface Tour {
  id?: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  durationLabel: string;
  priceLabel: string;
  images: string[];
  highlights: string[];
  featured?: boolean;
}

export interface BookingRequest {
  roomSlug: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  acRequested: boolean;
  fullName: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export interface BookingRecord extends BookingRequest {
  id: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  paypalOrderId?: string;
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
