-- Nobel Regency Hotel (Bibile) — Supabase schema
-- Run in the Supabase SQL editor.

create table if not exists rooms (
  slug text primary key,
  name text not null,
  total_units int not null default 1,
  price_per_night numeric not null,
  ac_surcharge_per_night numeric,
  has_ac_option boolean not null default false,
  currency text not null default 'LKR',
  max_guests int not null default 2,
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

-- Seed data (matches lib/rooms-data.ts — keep both in sync, or replace
-- lib/rooms-data.ts with a Supabase fetch once this is your source of truth)
insert into rooms (slug, name, total_units, price_per_night, ac_surcharge_per_night, has_ac_option, currency, max_guests) values
  ('double-room-garden-view', 'Double Room with Garden View', 4, 9500, 1500, true, 'LKR', 3),
  ('family-room-garden-view', 'Family Room with Garden View', 1, 13500, 2000, true, 'LKR', 7),
  ('cottage-bedroom', 'Cottage Bedroom', 2, 11000, 1500, true, 'LKR', 2),
  ('meditation-retreat-cottage', 'Meditation Retreat Cottage', 1, 8500, null, false, 'LKR', 2)
on conflict (slug) do nothing;
