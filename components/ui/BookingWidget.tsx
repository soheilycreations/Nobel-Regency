"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import { Calendar, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function BookingWidget({ variant = "floating" }: { variant?: "floating" | "inline" }) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(2);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn.toISOString().slice(0, 10));
    if (checkOut) params.set("checkOut", checkOut.toISOString().slice(0, 10));
    params.set("guests", String(guests));
    router.push(`/booking?${params.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={
        variant === "floating"
          ? "glass-panel relative z-20 mx-auto -mt-14 flex w-full max-w-5xl flex-col gap-4 rounded-2xl p-5 shadow-gold md:-mt-16 md:flex-row md:items-center md:gap-3 md:p-6"
          : "glass-panel flex w-full flex-col gap-4 rounded-2xl p-5 shadow-gold md:flex-row md:items-center md:gap-3 md:p-6"
      }
    >
      <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
        <Calendar size={18} className="text-gold" />
        <div className="flex w-full flex-col">
          <label className="text-[10px] uppercase tracking-wider text-white/50">Check-in</label>
          <DatePicker
            selected={checkIn}
            onChange={setCheckIn}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            minDate={new Date()}
            placeholderText="Add date"
            className="w-full bg-transparent text-sm text-white placeholder-white/40 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
        <Calendar size={18} className="text-gold" />
        <div className="flex w-full flex-col">
          <label className="text-[10px] uppercase tracking-wider text-white/50">Check-out</label>
          <DatePicker
            selected={checkOut}
            onChange={setCheckOut}
            selectsEnd
            startDate={checkIn}
            endDate={checkOut}
            minDate={checkIn ?? new Date()}
            placeholderText="Add date"
            className="w-full bg-transparent text-sm text-white placeholder-white/40 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
        <Users size={18} className="text-gold" />
        <div className="flex w-full flex-col">
          <label className="text-[10px] uppercase tracking-wider text-white/50">Guests</label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full bg-transparent text-sm text-white focus:outline-none [&>option]:bg-charcoal"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} Guest{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleSearch}
        className="gold-shimmer-btn whitespace-nowrap rounded-xl px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-charcoal-deep"
      >
        Book Now
      </button>
    </motion.div>
  );
}
