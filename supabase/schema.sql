-- Cloud9 Partners — database schema
-- Run this in the Supabase SQL editor (Dashboard -> SQL Editor -> New query).
-- Supabase Auth owns auth.users; these tables live in public and are accessed
-- ONLY through the Flask API (RLS locks out the anon/authenticated keys).

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'buyer' check (role in ('buyer', 'sales_rep', 'admin')),
  first_name text not null,
  last_name text not null,
  email text not null unique,
  phone text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.sales_rep_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles (id) on delete cascade,
  dealership_name text not null,
  location text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  review_comments text,
  rep_code text unique,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles (id) on delete cascade,
  service_type text not null check (service_type in ('consulting', 'quote_comparison')),
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'active', 'quoting', 'completed', 'cancelled')),
  vehicle_make text,
  vehicle_model text,
  vehicle_year text,
  vehicle_colour text,
  vehicle_variant text,
  vehicle_type text,
  preferred_brands jsonb default '[]'::jsonb,
  budget integer not null check (budget > 0),
  condition text,
  payment_method text,
  province text,
  timeline text,
  contact_method text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.service_requests (id) on delete cascade,
  sales_rep_id uuid not null references public.sales_rep_profiles (id) on delete cascade,
  price_cents bigint not null check (price_cents > 0),
  interest_rate numeric(5, 2),
  term_months integer,
  details text,
  status text not null default 'submitted' check (status in ('submitted', 'accepted', 'declined')),
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.service_requests (id) on delete cascade,
  provider text not null default 'payfast',
  amount_cents bigint not null,
  status text not null default 'initiated'
    check (status in ('initiated', 'complete', 'failed', 'cancelled')),
  provider_reference text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists idx_service_requests_buyer on public.service_requests (buyer_id);
create index if not exists idx_quotes_request on public.quotes (request_id);
create index if not exists idx_payments_request on public.payments (request_id);

-- Lock everything down: the browser only talks to Supabase for auth.
-- All data access goes through Flask, which connects directly to Postgres
-- (bypassing RLS). No policies = anon/authenticated keys can read nothing.
alter table public.profiles enable row level security;
alter table public.sales_rep_profiles enable row level security;
alter table public.service_requests enable row level security;
alter table public.quotes enable row level security;
alter table public.payments enable row level security;
