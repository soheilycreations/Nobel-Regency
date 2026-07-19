import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyRecaptcha } from "@/lib/recaptcha";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { recaptchaToken, roomSlug, checkIn, checkOut, guests, acRequested, fullName, email, phone, specialRequests } = body;

    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return NextResponse.json({ error: "Spam check failed. Please try the checkbox again." }, { status: 400 });
    }

    if (!roomSlug || !checkIn || !checkOut || !fullName || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("bookings")
      .insert({
        room_slug: roomSlug,
        check_in: checkIn,
        check_out: checkOut,
        guests,
        ac_requested: acRequested ?? false,
        guest_name: fullName,
        guest_email: email,
        guest_phone: phone,
        special_requests: specialRequests ?? null,
        status: "pending",
        payment_status: "unpaid",
      })
      .select()
      .single();

    if (error) {
      console.error("create-booking insert failed:", error.message);
      return NextResponse.json({ error: "Could not create booking." }, { status: 500 });
    }

    return NextResponse.json({ booking: data });
  } catch (err) {
    console.error("create-booking route failed:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
