"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Location } from "@/types";
import { MapPin } from "lucide-react";

export default function LocationCard({ location, index = 0 }: { location: Location; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group gold-border overflow-hidden rounded-2xl bg-charcoal-soft"
    >
      <div className="relative h-56 w-full overflow-hidden bg-charcoal">
        {location.images[0] ? (
          <Image
            src={location.images[0]}
            alt={location.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-white/25">No photo yet</div>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-serif text-xl text-white">{location.name}</h3>
        <p className="mt-1 text-sm text-white/50">{location.tagline}</p>
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex items-center gap-1.5 text-xs text-white/50">
            <MapPin size={13} className="text-gold" /> {location.distanceLabel}
          </div>
          <Link
            href={`/locations/${location.slug}`}
            className="text-sm uppercase tracking-wider text-white/70 transition-colors hover:text-gold"
          >
            Details →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
