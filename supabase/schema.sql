-- Nobel Regency Hotel (Bibile) — Supabase schema
-- Run in the Supabase SQL editor.

create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  location text not null default '',
  tagline text not null default '',
  description text not null default '',
  total_units int not null default 1,
  price_per_night numeric not null,
  ac_surcharge_per_night numeric,
  has_ac_option boolean not null default false,
  currency text not null default 'LKR',
  max_guests int not null default 2,
  size_sqm numeric,
  bed_type text not null default '',
  images jsonb not null default '[]'::jsonb,
  amenities jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists tours (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text not null default '',
  description text not null default '',
  duration_label text not null default '',
  price_label text not null default 'Contact for pricing',
  images jsonb not null default '[]'::jsonb,
  highlights jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  room_slug text not null references rooms(slug),
  check_in date not null,
  check_out date not null,
  guests int not null,
  ac_requested boolean not null default false,
  guest_name text not null,
  guest_email text not null,
  guest_phone text not null,
  special_requests text,
  status text not null default 'pending', -- pending | confirmed | cancelled
  paypal_order_id text,
  stay_range daterange generated always as (
    daterange(check_in, check_out, '[)')
  ) stored,
  created_at timestamptz default now()
);

-- Prevent overbooking at the database level. Each room type can have more
-- than one physical unit (e.g. 4 Garden Double Rooms), so a simple pairwise
-- exclusion constraint would incorrectly block a second confirmed booking
-- even when units are still free. Instead, this trigger counts overlapping
-- CONFIRMED bookings against rooms.total_units before allowing a booking to
-- become confirmed — the same trigger-first, DB-is-source-of-truth approach
-- used in the ScrapYard ledger.
create or replace function prevent_overbooking()
returns trigger
language plpgsql
as $$
declare
  v_total_units int;
  v_overlapping int;
begin
  if new.status = 'confirmed' then
    select total_units into v_total_units from rooms where slug = new.room_slug;

    select count(*) into v_overlapping
    from bookings
    where room_slug = new.room_slug
      and status = 'confirmed'
      and id <> new.id
      and daterange(check_in, check_out, '[)') && daterange(new.check_in, new.check_out, '[)');

    if v_overlapping >= coalesce(v_total_units, 1) then
      raise exception 'No units left for room % on the requested dates', new.room_slug;
    end if;
  end if;

  return new;
end;
$$;

create trigger trg_prevent_overbooking
  before insert or update on bookings
  for each row execute function prevent_overbooking();

-- RPC used by lib/supabase.ts::checkAvailability
create or replace function check_room_availability(
  p_room_slug text,
  p_check_in date,
  p_check_out date
) returns int
language plpgsql
as $$
declare
  v_total_units int;
  v_overlapping int;
begin
  select total_units into v_total_units from rooms where slug = p_room_slug;
  if v_total_units is null then
    return 0;
  end if;

  select count(*) into v_overlapping
  from bookings
  where room_slug = p_room_slug
    and status in ('pending', 'confirmed')
    and daterange(check_in, check_out, '[)') && daterange(p_check_in, p_check_out, '[)');

  return greatest(v_total_units - v_overlapping, 0);
end;
$$;

-- ------------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------------
-- Public (anon key): can read rooms/tours, and create bookings.
-- Admin (authenticated via Supabase Auth): full read/write on rooms/tours,
-- and read/update on bookings. The PayPal capture route uses the service
-- role key instead, which bypasses RLS entirely (server-only, never exposed
-- to the browser).

alter table rooms enable row level security;
alter table tours enable row level security;
alter table bookings enable row level security;

create policy "Public can read rooms" on rooms for select using (true);
create policy "Public can read tours" on tours for select using (true);
create policy "Public can create bookings" on bookings for insert with check (true);

create policy "Admins can manage rooms" on rooms for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admins can manage tours" on tours for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admins can read bookings" on bookings for select
  using (auth.role() = 'authenticated');
create policy "Admins can update bookings" on bookings for update
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ------------------------------------------------------------------
-- One-time manual setup (can't be done via SQL):
-- 1. Storage: create a public bucket named "property-photos"
--    (Dashboard → Storage → New Bucket → Public).
-- 2. Auth: create your admin login under Dashboard → Authentication →
--    Users → Add User (email + password). That's the only account that
--    should exist — there's no public sign-up flow in this app.
-- ------------------------------------------------------------------

-- Seed data (matches lib/rooms-data.ts / lib/tours-data.ts — once these
-- rows exist, the admin panel is the source of truth; the local files
-- become fallback data only).
--
-- NOTE: if you already ran an earlier version of this file against a live
-- Supabase project, the old rooms (double-room-garden-view, etc.) will
-- still be sitting in your `rooms` table alongside these new ones, since
-- `on conflict (slug) do nothing` only skips duplicates, it doesn't remove
-- old rows with different slugs. Easiest fix: delete the old ones directly
-- in /admin/rooms rather than re-running SQL.
insert into rooms (slug, name, location, tagline, description, total_units, price_per_night, has_ac_option, currency, max_guests, bed_type, images, amenities, featured) values
  ('ac-deluxe-room', 'AC Deluxe Room', 'Main Bungalow', 'A comfortable, air-conditioned deluxe room', 'A comfortable air-conditioned deluxe room, suited for 2 guests.', 2, 22, false, 'USD', 2, 'Double', '["/photos/bungalow-veranda-antiques-gym.jpg","/photos/garden-path-flowers.jpg","/photos/rustic-garden-seating.jpg"]', '["Air conditioning","Comfortable stay"]', true),
  ('ac-room', 'AC Room', 'Main Bungalow', 'Comfortable air-conditioned accommodation', 'Comfortable air-conditioned accommodation.', 2, 20, false, 'USD', 2, 'Double', '["/photos/bungalow-veranda-antiques-gym.jpg","/photos/breakfast-spread-overhead.jpg","/photos/garden-path-flowers.jpg"]', '["Air conditioning"]', false),
  ('family-room', 'Family Room', 'Main Bungalow', 'Suitable for families, with 4 beds', 'A family room with 4 beds, suitable for families.', 1, 20, false, 'USD', 4, '4 Beds', '["/photos/bungalow-veranda-antiques-gym.jpg","/photos/breakfast-spread-overhead.jpg","/photos/garden-path-flowers.jpg"]', '["Suitable for families"]', false),
  ('cabana-nature-stay', 'Cabana Nature Stay', 'Garden Grounds', 'A peaceful garden and nature experience', 'A peaceful cabana stay set in the garden, for a nature-focused experience away from the main bungalow.', 1, 32, false, 'USD', 2, 'Double', '["/photos/cottage-veranda-couple.jpg","/photos/rustic-garden-seating.jpg","/photos/banana-leaf-couple.jpg"]', '["Garden & nature setting","Peaceful surroundings"]', true)
on conflict (slug) do nothing;

insert into tours (slug, name, tagline, description, duration_label, price_label, images, highlights, featured) values
  ('gal-oya-experience-package', 'Gal Oya Experience Package', 'Sri Lanka''s only boat safari — elephants swimming between islands', 'Gal Oya National Park, near Inginiyagala, is the one national park in Sri Lanka where safaris happen by boat rather than jeep. On the Senanayake Samudra reservoir, guides watch for elephants swimming between islands, alongside crocodiles, deer, and rich birdlife — best in the dry season (roughly March-September). The area is also home to the Vedda, Sri Lanka''s indigenous forest-dwelling community. Boat safaris are booked through the Gal Oya Wildlife Department office in Inginiyagala; we arrange this directly for guests.', 'Half day (boat safari typically ~2 hours)', 'Contact for pricing', '["/photos/garden-sunflare.jpg"]', '["Boat safari on Senanayake Samudra reservoir","Chance to see swimming elephants","Vedda indigenous community nearby","Sightseeing support arranged by the hotel"]', true),
  ('dunhinda-falls-day-trip', 'Dunhinda Falls Day Trip', 'One of Sri Lanka''s best-known waterfalls, a short drive away', 'Dunhinda Falls is one of the most-visited waterfalls in Sri Lanka, reached via a short forest walk from the car park. Pairs well with a stop in Mahiyangana.', 'Half day', 'Contact for pricing', '["/photos/rustic-garden-seating.jpg"]', '["Short forest walk to the falls","Can be combined with Mahiyangana","Good for all fitness levels"]', false),
  ('maduru-oya-safari', 'Maduru Oya National Park Safari', 'A jeep safari through one of the island''s larger national parks', 'A jeep safari through Maduru Oya National Park, home to elephants, deer, and a wide range of birdlife.', 'Half day', 'Contact for pricing', '["/photos/banana-leaf-couple.jpg"]', '["Jeep safari","Elephants and diverse wildlife","Experienced local guides"]', false)
on conflict (slug) do nothing;
