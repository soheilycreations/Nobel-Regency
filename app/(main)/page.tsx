import dynamic from "next/dynamic";
import HeroSlider from "@/components/ui/HeroSlider";
import BookingWidget from "@/components/ui/BookingWidget";
import RoomCard from "@/components/ui/RoomCard";
import { ROOMS } from "@/lib/rooms-data";
import { Leaf, Dumbbell, Sparkles, Camera, HeartHandshake, Gem, Car } from "lucide-react";

// Heavy / below-the-fold components are code-split to keep initial load fast on mobile.
const LocalMap = dynamic(() => import("@/components/ui/LocalMap"), {
  loading: () => <div className="h-96 animate-pulse bg-charcoal-soft" />,
});
const LifeGallery = dynamic(() => import("@/components/ui/LifeGallery"), {
  loading: () => <div className="h-64 animate-pulse bg-charcoal-soft" />,
});
const Testimonials = dynamic(() => import("@/components/ui/Testimonials"), {
  loading: () => <div className="h-64 animate-pulse bg-charcoal-soft" />,
});

const AMENITIES = [
  { icon: Leaf, label: "Organic Garden & Food" },
  { icon: Gem, label: "Antique Collection" },
  { icon: Dumbbell, label: "On-site Gym" },
  { icon: Sparkles, label: "Beauty Salon" },
  { icon: Car, label: "Free Parking" },
  { icon: Camera, label: "Garden Photoshoots" },
  { icon: HeartHandshake, label: "Honeymoon Friendly" },
];

export default function HomePage() {
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
        <div className="grid gap-6 md:grid-cols-3">
          {ROOMS.map((room, i) => (
            <RoomCard key={room.slug} room={room} index={i} />
          ))}
        </div>
      </section>

      <section id="amenities" className="bg-charcoal-deep px-5 py-24 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Amenities</p>
            <h2 className="mt-3 font-serif text-3xl text-white md:text-4xl">
              Everything, Considered
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {AMENITIES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-charcoal-soft px-4 py-8 text-center"
              >
                <Icon size={22} className="text-gold" />
                <span className="text-xs text-white/70">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LifeGallery />
      <LocalMap />
      <Testimonials />
    </main>
  );
}
