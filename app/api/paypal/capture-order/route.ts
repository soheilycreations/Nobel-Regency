import { NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/paypal";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { BookingRequest } from "@/types";

export async function POST(req: Request) {
  try {
    const { orderId, booking } = (await req.json()) as { orderId: string; booking: BookingRequest };

    const capture = await capturePayPalOrder(orderId);
    const status = capture.status;

    if (status !== "COMPLETED") {
      return NextResponse.json({ error: `Payment not completed (status: ${status})` }, { status: 402 });
    }

    const { data, error } = await supabaseAdmin
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
        status: "confirmed",
        payment_status: "paid",
        paypal_order_id: orderId,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, booking: data });
  } catch (err) {
    console.error("PayPal capture-order failed:", err);
    return NextResponse.json({ error: "Could not confirm payment" }, { status: 500 });
  }
}
