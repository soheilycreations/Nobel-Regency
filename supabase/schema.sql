-- Nobel Regency Luxury Suite — Supabase schema
-- Run in the Supabase SQL editor.

create extension if not exists btree_gist;

create table if not exists rooms (
  slug text primary key,
  name text not null,
  total_units int not null default 1,
  price_per_night numeric not null,
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

-- Prevent overlapping CONFIRMED bookings for the same room (trigger-first,
-- same principle used in the ScrapYard financial ledger: the database is the
-- source of truth, not the client).
alter table bookings
  add constraint no_overlapping_confirmed_bookings
  exclude using gist (
    room_slug with =,
    stay_range with &&
  ) where (status = 'confirmed');

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
insert into rooms (slug, name, total_units, price_per_night, currency, max_guests) values
  ('regency-ocean-suite', 'Regency Ocean Suite', 4, 42000, 'LKR', 2),
  ('heritage-garden-room', 'Heritage Garden Room', 6, 28000, 'LKR', 2),
  ('presidential-gold-suite', 'Presidential Gold Suite', 1, 95000, 'LKR', 4)
on conflict (slug) do nothing;
