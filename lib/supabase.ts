import { createClient } from "@supabase/supabase-js";
import type { AvailabilityResult, BookingRequest } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// During local dev without env vars set, this client is created lazily so
// the app doesn't crash on import — calls will simply fail until configured.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

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
