"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getBookings, updateBookingStatus } from "@/lib/supabase";
import type { BookingRecord } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  pending: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  confirmed: "text-green-400 border-green-400/30 bg-green-400/10",
  cancelled: "text-red-400 border-red-400/30 bg-red-400/10",
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[] | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const [error, setError] = useState<string | null>(null);

  const load = () => getBookings().then(setBookings).catch((err) => setError(err.message));
  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (id: string, status: "pending" | "confirmed" | "cancelled") => {
    await updateBookingStatus(id, status);
    load();
  };

  const filtered = bookings?.filter((b) => filter === "all" || b.status === filter);

  return (
    <div>
      <h1 className="font-serif text-2xl text-white">Bookings</h1>
      <p className="mt-1 text-sm text-white/50">Review and manage guest booking requests.</p>

      <div className="mt-5 flex gap-2">
        {(["all", "pending", "confirmed", "cancelled"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-xs capitalize ${
              filter === s ? "bg-gold text-charcoal-deep" : "border border-white/15 text-white/60"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      {!bookings && !error && <Loader2 className="mt-6 animate-spin text-gold" size={24} />}

      <div className="mt-6 space-y-3">
        {filtered?.length === 0 && <p className="text-sm text-white/40">No bookings in this filter.</p>}
        {filtered?.map((b) => (
          <div key={b.id} className="rounded-xl border border-white/10 bg-charcoal-soft p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white">{b.fullName}</p>
                <p className="text-xs text-white/40">{b.email} · {b.phone}</p>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs capitalize ${STATUS_COLORS[b.status]}`}>
                {b.status}
              </span>
            </div>

            <div className="mt-3 grid gap-1 text-sm text-white/70 sm:grid-cols-2">
              <p>Room: {b.roomSlug}</p>
              <p>Guests: {b.guests}{b.acRequested ? " · AC requested" : ""}</p>
              <p>Check-in: {b.checkIn}</p>
              <p>Check-out: {b.checkOut}</p>
            </div>
            {b.specialRequests && (
              <p className="mt-2 text-xs text-white/50">Note: {b.specialRequests}</p>
            )}

            <div className="mt-4 flex gap-2">
              {(["pending", "confirmed", "cancelled"] as const)
                .filter((s) => s !== b.status)
                .map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(b.id, s)}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-xs capitalize text-white/60 hover:border-gold/40 hover:text-gold"
                  >
                    Mark {s}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
