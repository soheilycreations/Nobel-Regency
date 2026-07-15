"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const GALLERY = [
  {
    src: "/photos/organic-citrus-tree.jpg",
    alt: "Citrus growing in the organic garden at Nobel Regency",
    caption: "From the organic garden",
  },
  {
    src: "/photos/king-coconut-drink.jpg",
    alt: "Fresh king coconut served in a clay cup overlooking the garden",
    caption: "Fresh king coconut, garden-side",
  },
  {
    src: "/photos/breakfast-couple-garden.jpg",
    alt: "Guests enjoying a home-cooked breakfast in the garden",
    caption: "Home-cooked, organic breakfasts",
  },
  {
    src: "/photos/office-reception-sign.jpg",
    alt: "Hand-painted reception sign along the garden path",
    caption: "Find your way in",
  },
];

export default function LifeGallery() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-10">
      <div className="mb-12 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Life at Nobel Regency</p>
        <h2 className="mt-3 font-serif text-3xl text-white md:text-4xl">
          Straight From the Garden
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {GALLERY.map((item, i) => (
          <motion.div
            key={item.src}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="group gold-border relative aspect-[3/4] overflow-hidden rounded-2xl"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep/80 via-transparent to-transparent" />
            <p className="absolute bottom-3 left-3 right-3 text-xs text-white/85">{item.caption}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
