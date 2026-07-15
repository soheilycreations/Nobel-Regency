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

- **Layout fix**: the room detail page had no bottom padding on desktop, so
  content ran straight into the footer with no gap. Fixed in
  `app/rooms/[slug]/page.tsx`.
- **Room data corrected against the actual Booking.com listing**: sizes,
  guest capacity, and amenities for the two main bungalow rooms are no longer
  guesses — `Double Room with Garden View` (11 m², up to 3 guests) and
  `Family Room with Garden View` (21 m², up to 7 guests) now match the real
  listing exactly, including hairdryer, flat-screen TV, electric kettle, etc.
  Room slugs changed to match (`double-room-garden-view`,
  `family-room-garden-view`) — update anywhere you've already linked the old
  URLs.
- **Removed fabricated testimonials.** The previous version had invented
  guest names and quotes, which isn't something to publish as real reviews.
  The Guest Stories section now links straight to your actual Booking.com
  and Facebook reviews instead.
- **Distances corrected**: Maduru Oya National Park is 46 km (from your own
  listing, not the 28 km guessed earlier), and Dunhinda Falls (24 km) is
  added since it's mentioned in your listing too. Bibile Bubula and
  Mahiyangana distances are still from general web sources, not your
  listing — flagged as such, worth double-checking if you use them.
- Check-in (3:00 PM) / check-out (9:00 AM) times added to the booking page,
  taken from your listing.

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
2. **Real photos**: swapped in — `public/photos/` now has 12 real property
   photos (garden, bungalow veranda with the antiques/gym, the A-frame family
   cottage, organic citrus, king coconut, breakfast spreads) used across the
   hero, all 4 room galleries, and a new "Life at Nobel Regency" section on
   the homepage. Two uploads weren't used: a casual selfie (not really
   marketing material) and one that duplicated another close-up. Add more as
   you get them — every room only has 1-2 real photos each right now, mixed
   with photos of the garden generally rather than that specific room.
3. **Prices**: `lib/rooms-data.ts` has placeholder LKR prices for each room
   and AC surcharge — replace with your actual rates.
4. **Logo**: `public/brand/logo-transparent.png` is the background-removed
   full lockup (crest + wordmark); `crest-mark.png` is cropped to just the
   emblem for the navbar/footer/favicon. Background removal was done with a
   combination of AI segmentation + a manual alpha mask for the gold text
   (the automatic tool dropped the text on its own) — worth a quick look at
   full size before printing it anywhere, since blended/soft edges can show
   up more at large sizes than on screen.
5. **WhatsApp**: wired to the real number (+94 72 360 0056).
6. **Google Maps**: the location section links straight to your real
   Google Maps share link now. The embedded map itself still uses
   approximate Bibile town-centre coordinates (share links can't be
   reverse-geocoded automatically) — send over the plain latitude/longitude
   if you'd like the embed centred exactly on the property.
7. **Domain/SEO**: update `metadata` in `app/layout.tsx` and add a real
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
