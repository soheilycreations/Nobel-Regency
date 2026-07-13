"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Room } from "@/types";
import { formatPrice } from "@/lib/utils";

export default function RoomCard({ room, index = 0 }: { room: Room; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group gold-border overflow-hidden rounded-2xl bg-charcoal-soft"
    >
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={room.images[0]}
          alt={room.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {room.featured && (
          <span className="absolute left-4 top-4 rounded-full bg-gold-gradient px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-charcoal-deep">
            Featured
          </span>
        )}
      </div>

      <div className="p-6">
        <h3 className="font-serif text-xl text-white">{room.name}</h3>
        <p className="mt-1 text-sm text-white/50">{room.tagline}</p>

        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
          <div>
            <p className="text-lg font-semibold text-gold">
              {formatPrice(room.pricePerNight, room.currency)}
            </p>
            <p className="text-xs text-white/40">per night</p>
          </div>
          <Link
            href={`/rooms/${room.slug}`}
            className="text-sm uppercase tracking-wider text-white/70 transition-colors hover:text-gold"
          >
            View Suite →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
