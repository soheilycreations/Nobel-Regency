import Image from "next/image";
import Link from "next/link";
import { HOTEL } from "@/lib/rooms-data";

export default function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-navy-gold px-5 py-14 md:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/brand/crest-mark.png"
              alt="Nobel Regency Hotel crest"
              width={40}
              height={38}
              className="h-9 w-auto"
            />
            <p className="font-serif text-xl text-white">
              Nobel <span className="text-gold">Regency</span>
            </p>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/50">
            A garden bungalow hotel in Bibile — antique-filled rooms, a quiet
            retreat setting, and service guests keep coming back for.
          </p>
        </div>

        <div className="text-sm text-white/60">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-gold">Contact</p>
          <p>{HOTEL.shortAddress}</p>
          <p className="mt-1">+{HOTEL.whatsappNumber}</p>
          <p className="mt-1">reservations@nobelregency.lk</p>
          <div className="mt-3 flex gap-4">
            <a href={HOTEL.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
              Facebook
            </a>
            <a href={HOTEL.bookingComUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
              Booking.com
            </a>
          </div>
        </div>

        <div className="text-sm text-white/60">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-gold">Explore</p>
          <ul className="space-y-1">
            <li><Link href="/#rooms" className="hover:text-gold">Rooms &amp; Suites</Link></li>
            <li><Link href="/tours" className="hover:text-gold">Tours &amp; Experiences</Link></li>
            <li><Link href="/booking" className="hover:text-gold">Book a Stay</Link></li>
            <li><Link href="/#amenities" className="hover:text-gold">Amenities</Link></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-xs text-white/30">
        © {new Date().getFullYear()} Nobel Regency Hotel. All rights reserved.
      </div>
    </footer>
  );
}
