"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Carousel({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: -1 | 1) => {
    scrollRef.current?.scrollBy({ left: direction * 340, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4"
      >
        {children}
      </div>

      <button
        onClick={() => scroll(-1)}
        aria-label="Scroll left"
        className="absolute left-0 top-1/2 hidden -translate-y-1/2 -translate-x-4 rounded-full border border-gold/30 bg-charcoal-deep/90 p-2.5 text-gold shadow-lg backdrop-blur hover:bg-charcoal-deep md:flex"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => scroll(1)}
        aria-label="Scroll right"
        className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-4 rounded-full border border-gold/30 bg-charcoal-deep/90 p-2.5 text-gold shadow-lg backdrop-blur hover:bg-charcoal-deep md:flex"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
