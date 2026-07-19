import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { Check, Clock, Tag } from "lucide-react";
import { getTourBySlugRemote } from "@/lib/supabase";
import { HOTEL } from "@/lib/rooms-data";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const tour = await getTourBySlugRemote(params.slug);
  if (!tour) return {};
  return {
    title: `${tour.name} | Nobel Regency Hotel, Bibile`,
    description: tour.description,
  };
}

export default async function TourPage({ params }: { params: { slug: string } }) {
  const tour = await getTourBySlugRemote(params.slug);
  if (!tour) notFound();

  const message = encodeURIComponent(`Hi, I'd like to ask about the ${tour.name} tour.`);
  const whatsappHref = `https://wa.me/${HOTEL.whatsappNumber}?text=${message}`;

  return (
    <main className="px-5 pb-24 pt-28 md:px-10 md:pt-32">
      <div className="mx-auto max-w-4xl">
        <div className="relative h-72 overflow-hidden rounded-2xl bg-charcoal-soft md:h-96">
          {tour.images[0] ? (
            <Image src={tour.images[0]} alt={tour.name} fill priority sizes="100vw" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-white/25">No photo yet</div>
          )}
        </div>

        {tour.images.length > 1 && (
          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {tour.images.slice(1).map((src, i) => (
              <div key={src} className="relative aspect-square overflow-hidden rounded-xl">
                <Image
                  src={src}
                  alt={`${tour.name} photo ${i + 2}`}
                  fill
                  sizes="(max-width: 768px) 33vw, 25vw"
                  className="object-cover transition-transform hover:scale-105"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Tours & Experiences</p>
          <h1 className="mt-3 font-serif text-3xl text-white md:text-4xl">{tour.name}</h1>
          <p className="mt-2 text-white/50">{tour.tagline}</p>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/60">
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-gold" /> {tour.durationLabel}
            </span>
            <span className="flex items-center gap-1.5">
              <Tag size={14} className="text-gold" /> {tour.priceLabel}
            </span>
          </div>

          <p className="mt-6 max-w-2xl leading-relaxed text-white/70">{tour.description}</p>

          <div className="mt-8">
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-gold">Highlights</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {tour.highlights.map((h) => (
                <div key={h} className="flex items-center gap-2 text-sm text-white/70">
                  <Check size={14} className="text-gold" /> {h}
                </div>
              ))}
            </div>
          </div>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="gold-shimmer-btn mt-10 inline-block rounded-xl px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-charcoal-deep"
          >
            Enquire on WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
