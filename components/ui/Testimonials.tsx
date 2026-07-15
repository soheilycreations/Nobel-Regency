"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { HOTEL } from "@/lib/rooms-data";

// Paraphrased from real, verified guest reviews found on Booking.com and
// Wego for this property (11 Mahiyangana Road, Bibile — same address,
// same owner "Ruwan" mentioned across multiple independent listings).
// Rewritten in our own words rather than quoted verbatim; source noted on
// each. Replace with fresh ones periodically, or with official screenshots
// from the Booking.com extranet if you'd prefer exact wording.
const REVIEWS = [
  {
    text: "One guest booked a single night and ended up staying several weeks — praising how far the owner, Ruwan, went to help with anything they needed.",
    source: "Verified guest, via Wego",
  },
  {
    text: "Guests said the staff cooked them dinner and breakfast, and even let them help out in the kitchen.",
    source: "Verified guest, via Booking.com",
  },
  {
    text: "Tucked away in a quiet, secluded garden in central Bibile — one guest called the property clean, spacious, and bright, with two verandas they made good use of.",
    source: "Verified guest, via Booking.com",
  },
  {
    text: "A guest arriving late at night was welcomed with fresh juice, and later called the breakfast delicious.",
    source: "Verified guest, via Booking.com (translated)",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="mx-auto max-w-7xl px-5 py-24 md:px-10">
      <div className="mb-12 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Guest Stories</p>
        <h2 className="mt-3 font-serif text-3xl text-white md:text-4xl">
          What Guests Have Said
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-white/50">
          Paraphrased from real, verified reviews on Booking.com and Wego —
          not written by us.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {REVIEWS.map((review, i) => (
          <motion.div
            key={review.text.slice(0, 20)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="rounded-2xl border border-white/10 bg-charcoal-soft p-6"
          >
            <div className="mb-3 flex gap-1">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star key={idx} size={14} className="fill-gold text-gold" />
              ))}
            </div>
            <p className="text-sm leading-relaxed text-white/70">{review.text}</p>
            <p className="mt-4 text-xs uppercase tracking-wider text-gold/60">{review.source}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 text-center sm:flex-row">
        <a
          href={HOTEL.bookingComUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs uppercase tracking-wider text-white/50 underline decoration-gold/40 underline-offset-4 hover:text-gold"
        >
          Read more on Booking.com
        </a>
      </div>
    </section>
  );
}
