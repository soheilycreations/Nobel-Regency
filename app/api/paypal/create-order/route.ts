import { NextResponse } from "next/server";
import { getRoomBySlugRemote } from "@/lib/supabase";
import { createPayPalOrder } from "@/lib/paypal";
import { nightsBetween, lkrToUsd } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { roomSlug, checkIn, checkOut, acRequested } = await req.json();

    const room = await getRoomBySlugRemote(roomSlug);
    if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

    const nights = nightsBetween(checkIn, checkOut);
    const nightlyRate = room.pricePerNight + (acRequested && room.acSurchargePerNight ? room.acSurchargePerNight : 0);
    const total = nights * nightlyRate;
    // Rooms are priced in USD directly. lkrToUsd is only applied as a fallback
    // for any room priced in LKR (e.g. one added later via /admin) — PayPal
    // itself doesn't accept LKR as a checkout currency.
    const totalUsd = room.currency === "USD" ? total : lkrToUsd(total);

    if (totalUsd <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const order = await createPayPalOrder(totalUsd, `${room.name} — ${nights} night(s), Nobel Regency Hotel`);

    return NextResponse.json({ orderId: order.id, totalUsd });
  } catch (err) {
    console.error("PayPal create-order failed:", err);
    return NextResponse.json({ error: "Could not create PayPal order" }, { status: 500 });
  }
}
