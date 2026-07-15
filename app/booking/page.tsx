import { Suspense } from "react";
import BookingForm from "@/components/ui/BookingForm";
import { HOTEL } from "@/lib/rooms-data";

export const metadata = {
  title: "Book Your Stay | Nobel Regency Hotel, Bibile",
};

export default function BookingPage() {
  return (
    <main className="min-h-screen px-5 pb-24 pt-28 md:px-10 md:pt-36">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Reservations</p>
        <h1 className="mt-3 font-serif text-3xl text-white md:text-4xl">Complete Your Booking</h1>
        <p className="mt-2 text-sm text-white/50">Three steps. Under two minutes.</p>
        <p className="mt-2 text-xs text-white/30">
          Check-in from {HOTEL.checkInFrom} · Check-out by {HOTEL.checkOutBy}
        </p>
      </div>
      <Suspense fallback={<div className="text-center text-white/40">Loading…</div>}>
        <BookingForm />
      </Suspense>
    </main>
  );
}
