# Nobel Regency Luxury Suite

A mobile-first luxury hotel booking site built with Next.js 14 (App Router),
Tailwind CSS, Framer Motion, TanStack Query, React Hook Form + Zod, and Supabase.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project URL + anon key
npm run dev
```

Open http://localhost:3000

## What's wired up

- Full "Golden Luxury" design system (Tailwind tokens, gold-gradient buttons,
  glassmorphism panels, grain overlay) in `tailwind.config.ts` / `app/globals.css`.
- Home, room detail (`/rooms/[slug]`), and 3-step booking funnel (`/booking`).
- Sticky/floating booking widget, sticky mobile "Book Now" bar on room pages.
- Floating WhatsApp inquiry button — set the real number in `lib/rooms-data.ts`
  (`HOTEL.whatsappNumber`).
- Hotel schema.org structured data in `app/layout.tsx` for rich search results.
- `next/dynamic` code-splitting on the map and testimonials sections to keep
  the initial mobile load fast.
- Supabase queries (`lib/supabase.ts`) and a matching schema (`supabase/schema.sql`)
  with a trigger/exclusion-constraint pattern that prevents double-booking at
  the database level — the same approach used in the ScrapYard project.

## What you need to plug in before going live

1. **Supabase project**: run `supabase/schema.sql` in the SQL editor, then add
   your project URL/anon key to `.env.local`.
2. **Room content**: `lib/rooms-data.ts` currently holds mock rooms and stock
   Unsplash photos. Swap in real photos and copy, or wire it to fetch from the
   `rooms` table instead of the static array.
3. **WhatsApp number**: `HOTEL.whatsappNumber` in `lib/rooms-data.ts`.
4. **Brand assets**: `public/brand/logo.jpg` (original upload), `logo-full.png`
   (web-optimized full lockup), and `crest-mark.png` (cropped emblem, used in
   the navbar, footer, mobile menu, and hero) are already wired in. The site's
   navy (`#10213A`) was sampled directly from the crest's arch so it sits
   naturally alongside the gold. `app/favicon.ico` and `app/apple-icon.png`
   are generated from the crest too.
4. **Payment**: the booking funnel ends by writing a `pending` booking to
   Supabase and confirming by email/WhatsApp, rather than collecting card
   details in-browser — this is the safer default. If you want in-page card
   payment, PayHere (Sri Lanka-friendly) or Stripe Checkout are the two
   options I'd wire in next; both need a server route + webhook, which isn't
   included here.
4. **Google Maps**: `LocalMap.tsx` uses a keyless embed URL. For a richer,
   interactive map (custom pins per attraction) swap in the Google Maps
   JavaScript API with an API key.
5. **Domain/SEO**: update `metadata` in `app/layout.tsx` and add a real
   `app/sitemap.ts` + `app/robots.ts` once the domain is live.

## Folder structure

```
app/
  (main)/page.tsx        Home
  rooms/[slug]/page.tsx   Room detail
  booking/page.tsx        Booking funnel
components/
  layout/Navbar.tsx, Footer.tsx
  ui/HeroSlider.tsx, BookingWidget.tsx, BookingForm.tsx,
     RoomCard.tsx, Testimonials.tsx, LocalMap.tsx, WhatsAppButton.tsx
lib/
  supabase.ts   Supabase client + availability/booking functions
  rooms-data.ts Mock content (rooms, testimonials, hotel info)
  schemas.ts    Zod validation
  utils.ts      cn(), price/date formatting
supabase/
  schema.sql    Tables, RPC, and the no-double-booking constraint
```
