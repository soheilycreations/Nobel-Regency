"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BedDouble, Compass, CalendarCheck } from "lucide-react";
import { getRooms, getTours, getBookings } from "@/lib/supabase";

export default function AdminDashboard() {
  const [counts, setCounts] = useState<{ rooms: number; tours: number; pendingBookings: number } | null>(null);

  useEffect(() => {
    Promise.all([getRooms(), getTours(), getBookings().catch(() => [])]).then(([rooms, tours, bookings]) => {
      setCounts({
        rooms: rooms.length,
        tours: tours.length,
        pendingBookings: bookings.filter((b) => b.status === "pending").length,
      });
    });
  }, []);

  const cards = [
    { href: "/admin/rooms", label: "Rooms", icon: BedDouble, value: counts?.rooms },
    { href: "/admin/tours", label: "Tours", icon: Compass, value: counts?.tours },
    { href: "/admin/bookings", label: "Pending Bookings", icon: CalendarCheck, value: counts?.pendingBookings },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl text-white">Dashboard</h1>
      <p className="mt-1 text-sm text-white/50">Manage rooms, tours, and bookings.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {cards.map(({ href, label, icon: Icon, value }) => (
          <Link
            key={href}
            href={href}
            className="rounded-2xl border border-white/10 bg-charcoal-soft p-6 transition-colors hover:border-gold/30"
          >
            <Icon size={20} className="text-gold" />
            <p className="mt-3 text-2xl font-semibold text-white">{value ?? "—"}</p>
            <p className="text-sm text-white/50">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
