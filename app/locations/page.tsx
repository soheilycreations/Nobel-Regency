import LocationCard from "@/components/ui/LocationCard";
import { getLocations } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export const metadata = {
  title: "Places Near Nobel Regency Hotel | Bibile, Sri Lanka",
  description:
    "Nearby attractions from Nobel Regency Hotel in Bibile — Maduru Oya National Park, Dunhinda Falls, Bibile Bubula Natural Springs, and Mahiyangana Raja Maha Vihara.",
};

export default async function LocationsPage() {
  const locations = await getLocations();

  return (
    <main className="px-5 pb-24 pt-28 md:px-10 md:pt-36">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Nearby</p>
          <h1 className="mt-3 font-serif text-3xl text-white md:text-4xl">
            Places Worth Exploring
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/50">
            A few of the sights and spots within reach of Bibile, all near Nobel Regency Hotel.
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          {locations.map((location, i) => (
            <LocationCard key={location.id ?? location.slug} location={location} index={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
