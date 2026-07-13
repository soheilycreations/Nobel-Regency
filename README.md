# Nobel Regency Hotel — Bibile

A mobile-first booking site for a garden bungalow hotel in Bibile, Sri Lanka,
built with Next.js 14 (App Router), Tailwind CSS, Framer Motion, TanStack
Query, React Hook Form + Zod, and Supabase.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project URL + anon key
npm run dev
```

Open http://localhost:3000

## What's wired up

- Room/inventory model matches the real property: 4 individually bookable
  **Garden Double Rooms** in the main bungalow, 1 **Family Bedroom**, 2
  individually bookable **Cottage Bedrooms** in the separate family cottage,
  and 1 **Meditation Retreat Cottage** on the 15-acre grounds — see
  `lib/rooms-data.ts`.
- **AC as a per-booking option**: rooms that offer it show an "Add air
  conditioning" checkbox in the booking form with its own nightly surcharge,
  rather than being modelled as separate room types.
- 3-step booking funnel (dates/room → guest details → confirm), written to
  Supabase as a `pending` booking, confirmed by your team over WhatsApp —
  per your call to keep the custom form + WhatsApp confirm rather than
  redirecting straight to Booking.com.
- Booking.com and Facebook links in the footer, so guests who want instant
  online payment can still go there.
- Hotel schema.org structured data reflecting Bibile (not a fabricated star
  rating — add one back in `app/layout.tsx` if the property is formally
  rated).
- Nearby attractions (Bibile Bubula, Maduru Oya National Park, Mahiyangana)
  with **approximate** road distances — worth confirming exact figures from
  the property's own location before publishing.

## What you need to plug in before going live

1. **Supabase project**: run `supabase/schema.sql` in the SQL editor, then add
   your project URL/anon key to `.env.local`. The schema uses a trigger
   (`prevent_overbooking`) that checks confirmed bookings against each room
   type's `total_units` — correctly handles the 4 Garden Double Rooms as one
   pool of 4, not 4 separate exclusive slots.
2. **Real photos**: every image right now is a placeholder (stock photos —
   garden/bungalow/antique themed, not the actual property). Swap in real
   photos of the rooms, garden, antiques, and cottages in
   `lib/rooms-data.ts` as soon as you have them.
3. **Prices**: `lib/rooms-data.ts` has placeholder LKR prices for each room
   and AC surcharge — replace with your actual rates.
4. **WhatsApp number**: `HOTEL.whatsappNumber` in `lib/rooms-data.ts`.
5. **Google Maps**: `LocalMap.tsx` uses a keyless embed URL centred on
   approximate Bibile town coordinates — swap in the exact property pin.
6. **Domain/SEO**: update `metadata` in `app/layout.tsx` and add a real
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
  rooms-data.ts Room inventory, hotel info, testimonials
  schemas.ts    Zod validation
  utils.ts      cn(), price/date formatting
supabase/
  schema.sql    Tables, RPC, and the overbooking-prevention trigger
```
