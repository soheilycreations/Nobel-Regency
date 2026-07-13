"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2000",
    alt: "Garden bungalow veranda at golden hour",
  },
  {
    src: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=2000",
    alt: "Quiet green grounds at the retreat cottage",
  },
  {
    src: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=2000",
    alt: "Antique-furnished interior at Nobel Regency",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 150]);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      {SLIDES.map((slide, i) => (
        <motion.div
          key={slide.src}
          className="absolute inset-0"
          style={{ y }}
          initial={{ opacity: 0 }}
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="scale-110 object-cover"
          />
        </motion.div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 via-charcoal-deep/40 to-charcoal-deep" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/20 via-transparent to-navy/20" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 1 }}
        >
          <Image
            src="/brand/crest-mark.png"
            alt="Nobel Regency Hotel crest"
            width={64}
            height={60}
            className="mx-auto mb-5 h-14 w-auto drop-shadow-[0_0_18px_rgba(212,175,55,0.35)] md:h-16"
          />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-4 text-xs uppercase tracking-[0.35em] text-gold"
        >
          Bibile, Sri Lanka
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9 }}
          className="max-w-3xl font-serif text-4xl leading-tight text-white md:text-6xl lg:text-7xl"
        >
          A Garden Bungalow,<br className="hidden md:block" /> Steeped in Heritage
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9 }}
          className="mt-6 max-w-xl text-base text-white/70 md:text-lg"
        >
          Antique-filled rooms, a 2-acre garden, and 15 acres of quiet retreat
          land — the best hotel in Bibile for those who want to slow down.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.9 }}
        >
          <Link
            href="/booking"
            className="gold-shimmer-btn mt-10 inline-block rounded-full px-9 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-charcoal-deep"
          >
            Reserve Your Suite
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-8 bg-gold" : "w-3 bg-white/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
