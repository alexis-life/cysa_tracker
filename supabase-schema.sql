-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New Query)

create table tracker_data (
  id text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- Row Level Security: locked down by default, opened up for the anon key
-- since this is a single-user personal tracker (no login system).
alter table tracker_data enable row level security;

create policy "Allow anon read" on tracker_data
  for select using (true);

create policy "Allow anon write" on tracker_data
  for insert with check (true);

create policy "Allow anon update" on tracker_data
  for update using (true);
