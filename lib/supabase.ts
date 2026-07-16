import { createClient } from "@supabase/supabase-js";
import type { AvailabilityResult, BookingRequest, BookingRecord, Room, Tour } from "@/types";
import { ROOMS as SEED_ROOMS } from "@/lib/rooms-data";
import { TOURS as SEED_TOURS } from "@/lib/tours-data";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// During local dev without env vars set, this client is created lazily so
// the app doesn't crash on import — calls will simply fail until configured.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/* ------------------------------------------------------------------ */
/* Auth (admin panel)                                                  */
/* ------------------------------------------------------------------ */

export async function signInAdmin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return data;
}

export async function signOutAdmin() {
  await supabase.auth.signOut();
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/* ------------------------------------------------------------------ */
/* Rooms (public read, admin write)                                    */
/* ------------------------------------------------------------------ */

function rowToRoom(row: any): Room {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    location: row.location,
    tagline: row.tagline,
    description: row.description,
    pricePerNight: Number(row.price_per_night),
    acSurchargePerNight: row.ac_surcharge_per_night != null ? Number(row.ac_surcharge_per_night) : undefined,
    hasACOption: row.has_ac_option,
    currency: row.currency,
    maxGuests: row.max_guests,
    sizeSqm: row.size_sqm ?? undefined,
    bedType: row.bed_type,
    totalUnits: row.total_units,
    images: row.images ?? [],
    amenities: row.amenities ?? [],
    featured: row.featured ?? false,
  };
}

function roomToRow(room: Room) {
  return {
    slug: room.slug,
    name: room.name,
    location: room.location,
    tagline: room.tagline,
    description: room.description,
    price_per_night: room.pricePerNight,
    ac_surcharge_per_night: room.acSurchargePerNight ?? null,
    has_ac_option: room.hasACOption,
    currency: room.currency,
    max_guests: room.maxGuests,
    size_sqm: room.sizeSqm ?? null,
    bed_type: room.bedType,
    total_units: room.totalUnits,
    images: room.images,
    amenities: room.amenities,
    featured: room.featured ?? false,
  };
}

/** Fetches rooms from Supabase. Falls back to the bundled seed data if
 * Supabase isn't configured or the call fails — keeps the site working
 * during local dev and if the DB is briefly unreachable. */
export async function getRooms(): Promise<Room[]> {
  if (!isSupabaseConfigured) return SEED_ROOMS;
  const { data, error } = await supabase.from("rooms").select("*").order("price_per_night");
  if (error || !data || data.length === 0) {
    if (error) console.error("getRooms failed, using seed data:", error.message);
    return SEED_ROOMS;
  }
  return data.map(rowToRoom);
}

export async function getRoomBySlugRemote(slug: string): Promise<Room | undefined> {
  if (!isSupabaseConfigured) return SEED_ROOMS.find((r) => r.slug === slug);
  const { data, error } = await supabase.from("rooms").select("*").eq("slug", slug).maybeSingle();
  if (error || !data) {
    if (error) {
      console.error(
        `getRoomBySlugRemote("${slug}") failed — falling back to seed data. This usually means there` +
          ` are DUPLICATE rows with this slug in the rooms table (e.g. from re-running schema.sql after` +
          ` room names changed). Check with: select slug, count(*) from rooms group by slug having count(*) > 1;`,
        error.message
      );
    }
    return SEED_ROOMS.find((r) => r.slug === slug);
  }
  return rowToRoom(data);
}

export async function upsertRoom(room: Room) {
  const { data, error } = await supabase
    .from("rooms")
    .upsert(roomToRow(room), { onConflict: "slug" })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return rowToRoom(data);
}

export async function deleteRoom(slug: string) {
  const { error } = await supabase.from("rooms").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
}

/* ------------------------------------------------------------------ */
/* Tours (public read, admin write)                                    */
/* ------------------------------------------------------------------ */

function rowToTour(row: any): Tour {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    durationLabel: row.duration_label,
    priceLabel: row.price_label,
    images: row.images ?? [],
    highlights: row.highlights ?? [],
    featured: row.featured ?? false,
  };
}

function tourToRow(tour: Tour) {
  return {
    slug: tour.slug,
    name: tour.name,
    tagline: tour.tagline,
    description: tour.description,
    duration_label: tour.durationLabel,
    price_label: tour.priceLabel,
    images: tour.images,
    highlights: tour.highlights,
    featured: tour.featured ?? false,
  };
}

export async function getTours(): Promise<Tour[]> {
  if (!isSupabaseConfigured) return SEED_TOURS;
  const { data, error } = await supabase.from("tours").select("*").order("name");
  if (error || !data || data.length === 0) {
    if (error) console.error("getTours failed, using seed data:", error.message);
    return SEED_TOURS;
  }
  return data.map(rowToTour);
}

export async function getTourBySlugRemote(slug: string): Promise<Tour | undefined> {
  if (!isSupabaseConfigured) return SEED_TOURS.find((t) => t.slug === slug);
  const { data, error } = await supabase.from("tours").select("*").eq("slug", slug).maybeSingle();
  if (error || !data) {
    if (error) {
      console.error(
        `getTourBySlugRemote("${slug}") failed — falling back to seed data. This usually means there` +
          ` are DUPLICATE rows with this slug in the tours table. Check with:` +
          ` select slug, count(*) from tours group by slug having count(*) > 1;`,
        error.message
      );
    }
    return SEED_TOURS.find((t) => t.slug === slug);
  }
  return rowToTour(data);
}

export async function upsertTour(tour: Tour) {
  const { data, error } = await supabase
    .from("tours")
    .upsert(tourToRow(tour), { onConflict: "slug" })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return rowToTour(data);
}

export async function deleteTour(slug: string) {
  const { error } = await supabase.from("tours").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
}

/* ------------------------------------------------------------------ */
/* Photo uploads (Supabase Storage)                                    */
/* ------------------------------------------------------------------ */

/** Uploads a file to the `property-photos` bucket and returns its public
 * URL. The bucket must exist and be set to public read — see
 * supabase/schema.sql for the one-time setup note (buckets can't be created
 * via SQL, only via the dashboard or Storage API). */
export async function uploadPhoto(file: File, folder: "rooms" | "tours"): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("property-photos").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from("property-photos").getPublicUrl(path);
  return data.publicUrl;
}

/* ------------------------------------------------------------------ */
/* Availability + booking (guest-facing)                               */
/* ------------------------------------------------------------------ */

/**
 * Checks room availability for a date range.
 * Expects a Postgres function `check_room_availability(room_slug, check_in, check_out)`
 * that returns the number of rooms of that type left for the range.
 * Recommended schema:
 *   rooms(slug, total_units, ...)
 *   bookings(id, room_slug, check_in, check_out, status, guest_name, guest_email, guest_phone)
 * with an exclusion constraint / trigger on bookings to prevent double-booking
 * (daterange overlap check, similar to the ScrapYard trigger-first approach).
 */
export async function checkAvailability(
  roomSlug: string,
  checkIn: string,
  checkOut: string
): Promise<AvailabilityResult> {
  const { data, error } = await supabase.rpc("check_room_availability", {
    p_room_slug: roomSlug,
    p_check_in: checkIn,
    p_check_out: checkOut,
  });

  if (error) {
    console.error("Availability check failed:", error.message);
    return { available: false, roomsLeft: 0 };
  }

  const roomsLeft = typeof data === "number" ? data : 0;
  return { available: roomsLeft > 0, roomsLeft };
}

export async function createBooking(booking: BookingRequest) {
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      room_slug: booking.roomSlug,
      check_in: booking.checkIn,
      check_out: booking.checkOut,
      guests: booking.guests,
      ac_requested: booking.acRequested,
      guest_name: booking.fullName,
      guest_email: booking.email,
      guest_phone: booking.phone,
      special_requests: booking.specialRequests ?? null,
      status: "pending",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/* ------------------------------------------------------------------ */
/* Bookings (admin panel)                                               */
/* ------------------------------------------------------------------ */

function rowToBooking(row: any): BookingRecord {
  return {
    id: row.id,
    roomSlug: row.room_slug,
    checkIn: row.check_in,
    checkOut: row.check_out,
    guests: row.guests,
    acRequested: row.ac_requested,
    fullName: row.guest_name,
    email: row.guest_email,
    phone: row.guest_phone,
    specialRequests: row.special_requests ?? undefined,
    status: row.status,
    createdAt: row.created_at,
    paypalOrderId: row.paypal_order_id ?? undefined,
  };
}

export async function getBookings(): Promise<BookingRecord[]> {
  const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToBooking);
}

export async function updateBookingStatus(id: string, status: "pending" | "confirmed" | "cancelled") {
  const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}
