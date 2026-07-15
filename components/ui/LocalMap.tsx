"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { HOTEL } from "@/lib/rooms-data";

export default function LocalMap() {
  const { lat, lng } = HOTEL.coordinates;
  const mapSrc = `https://www.google.com/maps?q=${lat},${lng}&z=14&output=embed`;

  return (
    <section id="location" className="mx-auto max-w-7xl px-5 py-24 md:px-10">
      <div className="mb-12 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Location</p>
        <h2 className="mt-3 font-serif text-3xl text-white md:text-4xl">
          Rooted in Bibile&rsquo;s Countryside
        </h2>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="gold-border h-80 overflow-hidden rounded-2xl md:h-[26rem]"
        >
          <iframe
            src={mapSrc}
            className="h-full w-full grayscale invert-[0.92] contrast-[1.1]"
            loading="lazy"
            title="Nobel Regency Hotel location map"
          />
        </motion.div>

        <div className="flex flex-col justify-center gap-4">
          <p className="text-xs text-white/30">
            Map pin is approximate — use &ldquo;View on Google Maps&rdquo; below for the exact location.
          </p>
          <a
            href={HOTEL.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="gold-shimmer-btn mb-1 inline-block w-fit rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-charcoal-deep"
          >
            View on Google Maps
          </a>
          {HOTEL.nearbyAttractions.map((place, i) => (
            <motion.div
              key={place.name}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-charcoal-soft px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-gold" />
                <span className="text-sm text-white/80">{place.name}</span>
              </div>
              <span className="text-sm text-gold">{place.distanceKm} km</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
