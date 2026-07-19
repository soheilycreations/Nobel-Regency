"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { GalleryPhoto } from "@/types";

export default function LifeGallery({ photos }: { photos: GalleryPhoto[] }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-10">
      <div className="mb-12 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Life at Nobel Regency</p>
        <h2 className="mt-3 font-serif text-3xl text-white md:text-4xl">
          Straight From the Garden
        </h2>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
        {photos.map((item, i) => (
          <motion.div
            key={item.id ?? item.imageUrl}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="group gold-border relative aspect-[3/4] overflow-hidden rounded-2xl"
          >
            <Image
              src={item.imageUrl}
              alt={item.caption || "Nobel Regency Hotel"}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep/80 via-transparent to-transparent" />
            {item.caption && (
              <p className="absolute bottom-3 left-3 right-3 text-xs text-white/85">{item.caption}</p>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
