import nextDynamic from "next/dynamic";
import Link from "next/link";
import HeroSlider from "@/components/ui/HeroSlider";
import BookingWidget from "@/components/ui/BookingWidget";
import RoomCard from "@/components/ui/RoomCard";
import TourCard from "@/components/ui/TourCard";
import Carousel from "@/components/ui/Carousel";
import { getRooms, getTours, getLocations } from "@/lib/supabase";
import { Leaf, Dumbbell, Sparkles, Camera, HeartHandshake, Gem, Car, UtensilsCrossed } from "lucide-react";

// Without this, Next.js treats this page as static and bakes in whatever
// rooms/tours data existed at the last build/deploy — admin panel edits
// (new photos, price changes, etc.) wouldn't show up until the next deploy.
export const dynamic = "force-dynamic";

// Heavy / below-the-fold components are code-split to keep initial load fast on mobile.
const LocalMap = nextDynamic(() => import("@/components/ui/LocalMap"), {
  loading: () => <div className="h-96 animate-pulse bg-charcoal-soft" />,
});
const LifeGallery = nextDynamic(() => import("@/components/ui/LifeGallery"), {
  loading: () => <div className="h-64 animate-pulse bg-charcoal-soft" />,
});
const Testimonials = nextDynamic(() => import("@/components/ui/Testimonials"), {
  loading: () => <div className="h-64 animate-pulse bg-charcoal-soft" />,
});

const AMENITIES = [
  { icon: UtensilsCrossed, label: "Restaurant — Sri Lankan Meals" },
  { icon: Leaf, label: "Organic Garden & Food" },
  { icon: Gem, label: "Antique Collection" },
  { icon: Dumbbell, label: "On-site Gym" },
  { icon: Sparkles, label: "Beauty Salon" },
  { icon: Car, label: "Free Parking" },
  { icon: Camera, label: "Garden Photoshoots" },
  { icon: HeartHandshake, label: "Honeymoon Friendly" },
];

// Rooms and tours are fetched from Supabase (falling back to bundled seed
// data if Supabase isn't configured or unreachable), so edits made in
// /admin actually show up here.
export default async function HomePage() {
  const [rooms, tours, locations] = await Promise.all([getRooms(), getTours(), getLocations()]);

  return (
    <main className="overflow-x-hidden">
      <HeroSlider />

      <div className="px-5 md:px-10">
        <BookingWidget />
      </div>

      <section id="rooms" className="mx-auto max-w-7xl px-5 py-24 md:px-10">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Featured Rooms</p>
          <h2 className="mt-3 font-serif text-3xl text-white md:text-4xl">
            Suites Designed for Stillness
          </h2>
        </div>
        <Carousel>
          {rooms.map((room, i) => (
            <div key={room.id ?? room.slug} className="w-[280px] shrink-0 snap-start sm:w-[320px]">
              <RoomCard room={room} index={i} />
            </div>
          ))}
        </Carousel>
      </section>

      <section id="amenities" className="bg-charcoal-deep px-5 py-24 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Amenities</p>
            <h2 className="mt-3 font-serif text-3xl text-white md:text-4xl">
              Everything, Considered
            </h2>
          </div>
          <div className="mx-auto flex max-w-[760px] flex-wrap justify-center gap-6">
            {AMENITIES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex w-36 flex-col items-center gap-3 rounded-xl border border-white/10 bg-charcoal-soft px-4 py-8 text-center sm:w-40"
              >
                <Icon size={22} className="text-gold" />
                <span className="text-xs text-white/70">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tours" className="mx-auto max-w-7xl px-5 py-24 md:px-10">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Tours & Experiences</p>
          <h2 className="mt-3 font-serif text-3xl text-white md:text-4xl">
            Explore Beyond the Garden
          </h2>
        </div>
        <Carousel>
          {tours.map((tour, i) => (
            <div key={tour.id ?? tour.slug} className="w-[280px] shrink-0 snap-start sm:w-[320px]">
              <TourCard tour={tour} index={i} />
            </div>
          ))}
        </Carousel>
        <div className="mt-8 text-center">
          <Link
            href="/tours"
            className="text-sm uppercase tracking-wider text-white/60 underline decoration-gold/40 underline-offset-4 hover:text-gold"
          >
            See all tours
          </Link>
        </div>
      </section>

      <LifeGallery />
      <LocalMap locations={locations} />
      <Testimonials />
    </main>
  );
}
