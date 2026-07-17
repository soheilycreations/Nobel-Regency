# Nobel Regency Hotel — Bibile

A mobile-first booking site for a garden bungalow hotel in Bibile, Sri Lanka.
Next.js 14 (App Router), Tailwind CSS, Framer Motion, TanStack Query, React
Hook Form + Zod, Supabase (database, auth, storage), and PayPal.

## ⚠️ Action required if you already have a live Supabase project

Re-run the **entire** `supabase/schema.sql` file in the SQL editor, even if
you've run earlier versions before. It now includes a repair block that
retroactively adds any columns/constraints your existing tables might be
missing — importantly, the `unique` constraint on `slug`, which earlier
versions of this file could silently fail to apply to an already-existing
table (`create table if not exists` does nothing if the table already
exists — it does NOT add new columns or constraints to it). Without that
constraint, duplicate-slug rows are possible, which causes exactly the kind
of "works on one page, not on another" inconsistency you may have seen.

If the repair block reports the constraint can't be added because
duplicates already exist, check `/admin/rooms` and `/admin/tours` (they'll
show a warning banner) and delete the extras there, then re-run the file.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the values below
npm run dev
```

Open http://localhost:3000 — the public site works immediately with bundled
placeholder data. To get the admin panel, database-backed rooms/tours, and
PayPal working, follow the setup steps below.

## Architecture

- **Public site** (`/`, `/rooms/[slug]`, `/tours`, `/tours/[slug]`,
  `/booking`) reads rooms and tours from Supabase, falling back to the
  bundled seed data in `lib/rooms-data.ts` / `lib/tours-data.ts` if Supabase
  isn't configured or briefly unreachable. This means the site works out of
  the box, and anything you edit in `/admin` shows up live on the public
  pages.
- **Admin panel** (`/admin`) — protected by Supabase Auth. Add/edit/delete
  rooms and tours (with photo upload to Supabase Storage), and review/update
  bookings. There's no public sign-up; accounts are created directly in the
  Supabase dashboard, so you control exactly who has access (supports
  multiple staff logins, as requested).
- **Bookings**: a guest fills out the 3-step form and either (a) submits a
  `pending` booking that your team confirms over WhatsApp, or (b) pays
  immediately via PayPal, which auto-confirms the booking once PayPal
  verifies the payment server-side.
- **Database**: Postgres via Supabase. `supabase/schema.sql` has the full
  schema, Row Level Security policies, and a trigger that prevents
  overbooking a room type across its multiple physical units.

## Rooms are now your real pricing (USD)

Replaced the placeholder LKR rooms with the 4 real rooms and prices you gave:
AC Deluxe Room (USD 22), AC Room (USD 20), Family Room (USD 20, 4 beds),
Cabana Nature Stay (USD 32). Since PayPal doesn't accept LKR anyway, this
also means PayPal checkout no longer needs an approximate currency
conversion — it charges the real USD price directly.

A few things weren't specified and I filled in reasonably — worth checking
in `/admin/rooms` and correcting if wrong:
- **Guest capacity** for AC Room and Cabana Nature Stay (assumed 2 each).
- **Unit counts** (how many of each room physically exist) — assumed 2 for
  AC Deluxe Room and AC Room, 1 for Family Room and Cabana Nature Stay.
- **Bed type** for everything except Family Room (which you said has 4 beds).

Also added: **Restaurant** (Sri Lankan meals, breakfast & dinner) as a
homepage amenity, and replaced two speculative Gal-Oya-related placeholder
tours with your confirmed **Gal Oya Experience Package** (nature attractions,
local culture, sightseeing support) — kept Dunhinda Falls and Maduru Oya
Safari as still-placeholder since those weren't part of what you sent.

## Setup steps

### 1. Supabase (database + auth + storage)

1. Create a project at supabase.com.
2. Run `supabase/schema.sql` in the SQL editor — creates `rooms`, `tours`,
   `bookings`, the overbooking-prevention trigger, RLS policies, and seeds
   the current rooms/tours.
3. Storage → New Bucket → name it `property-photos`, set it **Public**.
   (Buckets can't be created via SQL, only the dashboard or Storage API.)
4. Back in the SQL Editor, run the storage policies block at the bottom of
   `schema.sql` (the `create policy ... on storage.objects` statements).
   **This step is easy to miss** — a "Public" bucket only controls who can
   *view* photos, not who can upload them. Skipping this gives you "new row
   violates row-level security policy" the first time you try to upload a
   photo in `/admin`, even while logged in correctly.
5. Authentication → Users → Add User, once per staff member who needs admin
   access. Email + password — that's the login for `/admin`. There's no
   other way to create an account, which is intentional.
6. Copy your Project URL and anon key into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
7. Project Settings → API → service_role key → also into `.env.local` as
   `SUPABASE_SERVICE_ROLE_KEY`. This one is server-only and bypasses Row
   Level Security — it's what lets a guest's PayPal payment confirm their
   own booking without needing to log in. Never expose it to the browser.

### 2. PayPal (sandbox first, as agreed)

1. developer.paypal.com → Apps & Credentials → make sure you're on
   **Sandbox** mode → Create App. Copy the Client ID and Secret.
2. Add to `.env.local`:
   ```
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-sandbox-client-id
   PAYPAL_CLIENT_ID=your-sandbox-client-id
   PAYPAL_CLIENT_SECRET=your-sandbox-secret
   PAYPAL_ENV=sandbox
   ```
3. Test with PayPal's sandbox buyer account (developer.paypal.com →
   Sandbox → Accounts — there's a default test buyer login).
4. When you're ready to take real payments: create a **Live** app on the
   same PayPal developer site, swap in the live Client ID/Secret, and set
   `PAYPAL_ENV=live`.
5. **Currency note**: PayPal doesn't support LKR as a checkout currency, so
   PayPal payments run in USD, converted at an approximate rate hardcoded in
   `lib/utils.ts` (`APPROX_LKR_PER_USD`). This is clearly shown to the guest
   before they pay, but update that number periodically — it will drift from
   the real market rate over time.

### 3. Tours and pricing

Tours are placeholder content — real regional activities (Gal Oya boat
safari, Vedda village walks, Dunhinda Falls, Maduru Oya safari) but with
"Contact for pricing" instead of real prices, as agreed. Edit them properly
in `/admin/tours` once you have durations, prices, and operator details
sorted out.

## Known limitations, worth knowing about

- **Admin auth check runs client-side** (in `app/admin/layout.tsx`), not in
  Next.js middleware. It redirects unauthenticated visitors before any admin
  UI renders, and the actual data is still protected server-side by Row
  Level Security either way — but a more locked-down setup would move the
  session check into middleware using `@supabase/ssr`. Worth doing before
  this holds anything more sensitive than room/tour content.
- **No Google/TripAdvisor reviews embedded.** I could only verify real
  reviews via Booking.com and Wego for this exact property (see
  `components/ui/Testimonials.tsx` — paraphrased, sourced, not invented). A
  similarly-named "Nobel Regency" on TripAdvisor is actually in Badulla, a
  different town, so I didn't use it. Send screenshots from your Google
  Business dashboard if you want real Google reviews added.
- **Room photos are mostly general property/garden shots**, not photos of
  each specific room's interior — upload real per-room photos via
  `/admin/rooms` as you get them.
- **Google Maps embed uses approximate Bibile town-centre coordinates**, not
  the exact property pin (share links can't be reverse-geocoded
  automatically) — the "View on Google Maps" link nearby is accurate, the
  embedded map graphic itself is not exact.

## Folder structure

```
app/
  (main)/page.tsx          Home
  rooms/[slug]/page.tsx    Room detail
  tours/, tours/[slug]/    Tours
  booking/page.tsx         Booking funnel
  admin/                   Admin panel (login, dashboard, rooms, tours, bookings)
  api/paypal/              create-order + capture-order route handlers
components/
  layout/                  Navbar, Footer
  ui/                      HeroSlider, BookingForm, PayPalButton, RoomCard, TourCard, etc.
  admin/                   ImageManager (Supabase Storage uploads)
lib/
  supabase.ts              Supabase client + rooms/tours/bookings CRUD + auth helpers
  supabase-admin.ts        Server-only client (service role key) — API routes only
  paypal.ts                Server-only PayPal REST helper — API routes only
  rooms-data.ts, tours-data.ts   Seed/fallback content + HOTEL info
  schemas.ts, utils.ts
supabase/
  schema.sql               Tables, RLS policies, overbooking trigger
```
