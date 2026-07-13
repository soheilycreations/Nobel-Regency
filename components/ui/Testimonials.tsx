"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/rooms-data";

export default function Testimonials() {
  return (
    <section id="testimonials" className="mx-auto max-w-7xl px-5 py-24 md:px-10">
      <div className="mb-12 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Guest Stories</p>
        <h2 className="mt-3 font-serif text-3xl text-white md:text-4xl">
          Told in Their Own Words
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.6 }}
            className="rounded-2xl border border-white/10 bg-charcoal-soft p-6"
          >
            <div className="mb-3 flex gap-1">
              {Array.from({ length: t.rating }).map((_, idx) => (
                <Star key={idx} size={14} className="fill-gold text-gold" />
              ))}
            </div>
            <p className="text-sm leading-relaxed text-white/70">&ldquo;{t.quote}&rdquo;</p>
            <p className="mt-4 text-sm font-medium text-white">
              {t.name} <span className="text-white/40">— {t.country}</span>
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
