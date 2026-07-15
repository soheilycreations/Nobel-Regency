"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { HOTEL } from "@/lib/rooms-data";

export default function Testimonials() {
  return (
    <section id="testimonials" className="mx-auto max-w-7xl px-5 py-24 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl rounded-2xl border border-gold/20 bg-charcoal-soft p-10 text-center"
      >
        <div className="mb-3 flex justify-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={16} className="text-gold/40" />
          ))}
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Guest Stories</p>
        <h2 className="mt-3 font-serif text-3xl text-white md:text-4xl">
          Read Real Reviews
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/60">
          Rather than make up quotes, we&rsquo;d rather point you to what
          guests have actually said on Booking.com and Facebook.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={HOTEL.bookingComUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="gold-shimmer-btn rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-charcoal-deep"
          >
            Reviews on Booking.com
          </a>
          <a
            href={HOTEL.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-gold/30 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-gold"
          >
            Visit our Facebook
          </a>
        </div>
      </motion.div>
    </section>
  );
}
