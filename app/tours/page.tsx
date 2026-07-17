import TourCard from "@/components/ui/TourCard";
import { getTours } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tours & Experiences | Nobel Regency Hotel, Bibile",
  description: "Guided tours near Nobel Regency Hotel in Bibile — Gal Oya boat safari, Vedda village walks, Dunhinda Falls, and Maduru Oya National Park.",
};

export default async function ToursPage() {
  const tours = await getTours();

  return (
    <main className="px-5 pb-24 pt-28 md:px-10 md:pt-36">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Tours & Experiences</p>
          <h1 className="mt-3 font-serif text-3xl text-white md:text-4xl">
            Explore the Region With Us
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/50">
            Arranged directly through the hotel — message us on WhatsApp to check availability and pricing.
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          {tours.map((tour, i) => (
            <TourCard key={tour.id ?? tour.slug} tour={tour} index={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
