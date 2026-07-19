import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Check, MapPin } from "lucide-react";
import { getLocationBySlugRemote } from "@/lib/supabase";
import { HOTEL } from "@/lib/rooms-data";
import BackButton from "@/components/ui/BackButton";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const location = await getLocationBySlugRemote(params.slug);
  if (!location) return {};
  return {
    title: `${location.name} — Near Nobel Regency Hotel, Bibile`,
    description: location.description,
  };
}

export default async function LocationPage({ params }: { params: { slug: string } }) {
  const location = await getLocationBySlugRemote(params.slug);
  if (!location) notFound();

  const message = encodeURIComponent(`Hi, I'd like to ask about visiting ${location.name}.`);
  const whatsappHref = `https://wa.me/${HOTEL.whatsappNumber}?text=${message}`;

  return (
    <main className="px-5 pb-24 pt-28 md:px-10 md:pt-32">
      <div className="mx-auto max-w-4xl">
        <BackButton fallbackHref="/locations" />
        <div className="relative h-72 overflow-hidden rounded-2xl bg-charcoal-soft md:h-96">
          {location.images[0] ? (
            <Image src={location.images[0]} alt={location.name} fill priority sizes="100vw" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-white/25">No photo yet</div>
          )}
        </div>

        {location.images.length > 1 && (
          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {location.images.slice(1).map((src, i) => (
              <div key={src} className="relative aspect-square overflow-hidden rounded-xl">
                <Image
                  src={src}
                  alt={`${location.name} photo ${i + 2}`}
                  fill
                  sizes="(max-width: 768px) 33vw, 25vw"
                  className="object-cover transition-transform hover:scale-105"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Nearby</p>
          <h1 className="mt-3 font-serif text-3xl text-white md:text-4xl">{location.name}</h1>
          <p className="mt-2 text-white/50">{location.tagline}</p>

          <div className="mt-4 flex items-center gap-1.5 text-sm text-white/60">
            <MapPin size={14} className="text-gold" /> {location.distanceLabel}
          </div>

          <p className="mt-6 max-w-2xl leading-relaxed text-white/70">{location.description}</p>

          {location.highlights.length > 0 && (
            <div className="mt-8">
              <p className="mb-4 text-xs uppercase tracking-[0.2em] text-gold">Good to Know</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {location.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-2 text-sm text-white/70">
                    <Check size={14} className="text-gold" /> {h}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="gold-shimmer-btn inline-block rounded-xl px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-charcoal-deep"
            >
              Ask About Visiting
            </a>
            <Link
              href="/booking"
              className="inline-block rounded-xl border border-gold/30 px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-gold"
            >
              Book Your Stay
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
