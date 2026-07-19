import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getRoomBySlugRemote } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import { Check } from "lucide-react";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const room = await getRoomBySlugRemote(params.slug);
  if (!room) return {};
  return {
    title: `${room.name} | Nobel Regency Hotel, Bibile`,
    description: room.description,
  };
}

export default async function RoomPage({ params }: { params: { slug: string } }) {
  const room = await getRoomBySlugRemote(params.slug);
  if (!room) notFound();

  return (
    <main className="pt-28 md:pb-24 md:pt-32">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="grid gap-3 md:grid-cols-3 md:gap-4">
          <div className="relative h-80 overflow-hidden rounded-2xl bg-charcoal-soft md:col-span-2 md:h-[28rem]">
            {room.images[0] ? (
              <Image
                src={room.images[0]}
                alt={room.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-white/25">No photo yet</div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-1 md:gap-4">
            {room.images.slice(1, 3).map((src, i) => (
              <div key={src} className="relative h-38 overflow-hidden rounded-2xl md:h-[13.2rem]">
                <Image
                  src={src}
                  alt={`${room.name} view ${i + 2}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {room.images.length > 3 && (
          <div className="mt-4">
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {room.images.slice(3).map((src, i) => (
                <div key={src} className="relative aspect-square overflow-hidden rounded-xl">
                  <Image
                    src={src}
                    alt={`${room.name} photo ${i + 4}`}
                    fill
                    sizes="(max-width: 768px) 33vw, 20vw"
                    className="object-cover transition-transform hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">
              {room.location} · {room.bedType}
              {room.sizeSqm ? ` · ${room.sizeSqm} m²` : ""} · Up to {room.maxGuests} guests
            </p>
            <h1 className="mt-3 font-serif text-3xl text-white md:text-4xl">{room.name}</h1>
            <p className="mt-2 text-white/50">{room.tagline}</p>
            <p className="mt-6 max-w-2xl leading-relaxed text-white/70">{room.description}</p>
            {room.hasACOption && (
              <p className="mt-3 text-sm text-gold/80">
                Available with or without air conditioning (+{formatPrice(room.acSurchargePerNight ?? 0, room.currency)}/night)
              </p>
            )}

            <div className="mt-8">
              <p className="mb-4 text-xs uppercase tracking-[0.2em] text-gold">Amenities</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {room.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-2 text-sm text-white/70">
                    <Check size={14} className="text-gold" /> {a}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-gold/25 bg-charcoal-soft p-6">
            <p className="text-2xl font-semibold text-gold">
              {formatPrice(room.pricePerNight, room.currency)}
            </p>
            <p className="text-xs text-white/40">per night, taxes included</p>
            <Link
              href={`/booking?room=${room.slug}`}
              className="gold-shimmer-btn mt-6 block rounded-xl py-3.5 text-center text-sm font-semibold uppercase tracking-[0.12em] text-charcoal-deep"
            >
              Book This Suite
            </Link>
          </aside>
        </div>
      </div>

      {/* Sticky mobile book-now bar */}
      <div className="glass-panel fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between px-5 py-4 md:hidden">
        <div>
          <p className="text-sm font-semibold text-gold">
            {formatPrice(room.pricePerNight, room.currency)}
          </p>
          <p className="text-[10px] text-white/40">per night</p>
        </div>
        <Link
          href={`/booking?room=${room.slug}`}
          className="gold-shimmer-btn rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-charcoal-deep"
        >
          Book Now
        </Link>
      </div>
      <div className="h-20 md:hidden" />
    </main>
  );
}
