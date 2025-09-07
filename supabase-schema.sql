-- =============================================================================
-- COLLECTIVE ASSETS DATABASE SCHEMA FOR SUPABASE
-- =============================================================================
-- This file contains the complete database schema for the collective assets
-- management application. Run this in your Supabase SQL editor.

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- =============================================================================
-- TABLES CREATION (Create all tables first)
-- =============================================================================

-- USER PROFILES TABLE
-- Extends the auth.users table with additional profile information
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  phone text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ITEMS TABLE
-- Main table for shared assets/items
create table public.items (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  category text not null, -- e.g., 'property', 'vehicle', 'equipment'
  total_value decimal(12,2) not null default 0,
  purchase_date date,
  location text,
  status text not null default 'active', -- 'active', 'sold', 'disposed'
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ITEM OWNERS TABLE
-- Junction table for item ownership with ownership percentages
create table public.item_owners (
  id uuid default uuid_generate_v4() primary key,
  item_id uuid references public.items(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  ownership_percentage decimal(5,2) not null check (ownership_percentage > 0 and ownership_percentage <= 100),
  role text not null default 'co-owner', -- 'owner', 'co-owner', 'manager'
  joined_at timestamptz default now() not null,
  unique(item_id, user_id)
);

-- DOCUMENTS TABLE
-- Store documents related to items (contracts, receipts, manuals, etc.)
create table public.documents (
  id uuid default uuid_generate_v4() primary key,
  item_id uuid references public.items(id) on delete cascade not null,
  title text not null,
  description text,
  document_type text not null, -- 'contract', 'receipt', 'manual', 'photo', 'other'
  file_url text, -- Supabase storage URL
  file_name text,
  file_size bigint, -- in bytes
  mime_type text,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- BOOKINGS TABLE
-- Track usage/booking of shared items
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  item_id uuid references public.items(id) on delete cascade not null,
  booked_by uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  start_date timestamptz not null,
  end_date timestamptz not null,
  status text not null default 'confirmed', -- 'pending', 'confirmed', 'cancelled', 'completed'
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  check (end_date > start_date)
);

-- EXPENSES TABLE
-- Track expenses related to items (bills, maintenance, etc.)
create table public.expenses (
  id uuid default uuid_generate_v4() primary key,
  item_id uuid references public.items(id) on delete cascade not null,
  title text not null,
  description text,
  amount decimal(10,2) not null,
  expense_type text not null, -- 'maintenance', 'utilities', 'insurance', 'tax', 'other'
  expense_date date not null default current_date,
  is_recurring boolean not null default false,
  recurring_period text, -- 'monthly', 'quarterly', 'annually' (only if is_recurring = true)
  next_due_date date, -- for recurring expenses
  paid_by uuid references public.profiles(id) on delete set null,
  split_method text not null default 'equal', -- 'equal', 'by_ownership', 'custom'
  receipt_url text, -- Supabase storage URL for receipt
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- EXPENSE SPLITS TABLE
-- Track how expenses are split among co-owners
create table public.expense_splits (
  id uuid default uuid_generate_v4() primary key,
  expense_id uuid references public.expenses(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  amount_owed decimal(10,2) not null,
  amount_paid decimal(10,2) not null default 0,
  paid_at timestamptz,
  created_at timestamptz default now() not null,
  unique(expense_id, user_id)
);

-- NOTIFICATIONS TABLE
-- System notifications for users
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  type text not null, -- 'booking', 'expense', 'payment', 'system'
  related_id uuid, -- ID of related item, booking, expense, etc.
  read boolean not null default false,
  created_at timestamptz default now() not null
);

-- =============================================================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================================================

alter table public.profiles enable row level security;
alter table public.items enable row level security;
alter table public.item_owners enable row level security;
alter table public.documents enable row level security;
alter table public.bookings enable row level security;
alter table public.expenses enable row level security;
alter table public.expense_splits enable row level security;
alter table public.notifications enable row level security;

-- =============================================================================
-- POLICIES (Create all policies after tables are created)
-- =============================================================================

-- Profiles policies
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Items policies - users can only see items they own or co-own
create policy "Users can view items they own or co-own" on public.items
  for select using (
    id in (
      select item_id from public.item_owners
      where user_id = auth.uid()
    )
  );

create policy "Users can insert items" on public.items
  for insert with check (auth.uid() = created_by);

create policy "Item owners can update items" on public.items
  for update using (
    id in (
      select item_id from public.item_owners
      where user_id = auth.uid()
    )
  );

-- Item owners policies
create policy "Users can view ownership records for their items" on public.item_owners
  for select using (
    user_id = auth.uid() or
    item_id in (
      select item_id from public.item_owners
      where user_id = auth.uid()
    )
  );

create policy "Item owners can insert new owners" on public.item_owners
  for insert with check (
    item_id in (
      select item_id from public.item_owners
      where user_id = auth.uid() and role in ('owner', 'manager')
    )
  );

-- Documents policies
create policy "Users can view documents for items they own" on public.documents
  for select using (
    item_id in (
      select item_id from public.item_owners
      where user_id = auth.uid()
    )
  );

create policy "Users can upload documents for items they own" on public.documents
  for insert with check (
    item_id in (
      select item_id from public.item_owners
      where user_id = auth.uid()
    )
  );

-- Bookings policies
create policy "Users can view bookings for items they own" on public.bookings
  for select using (
    item_id in (
      select item_id from public.item_owners
      where user_id = auth.uid()
    )
  );

create policy "Users can create bookings for items they own" on public.bookings
  for insert with check (
    item_id in (
      select item_id from public.item_owners
      where user_id = auth.uid()
    )
  );

-- Expenses policies
create policy "Users can view expenses for items they own" on public.expenses
  for select using (
    item_id in (
      select item_id from public.item_owners
      where user_id = auth.uid()
    )
  );

create policy "Users can add expenses for items they own" on public.expenses
  for insert with check (
    item_id in (
      select item_id from public.item_owners
      where user_id = auth.uid()
    )
  );

-- Expense splits policies
create policy "Users can view their own expense splits" on public.expense_splits
  for select using (
    user_id = auth.uid() or
    expense_id in (
      select e.id from public.expenses e
      join public.item_owners io on e.item_id = io.item_id
      where io.user_id = auth.uid()
    )
  );

-- Notifications policies
create policy "Users can view their own notifications" on public.notifications
  for select using (auth.uid() = user_id);

create policy "Users can update their own notifications" on public.notifications
  for update using (auth.uid() = user_id);

-- =============================================================================
-- FUNCTIONS AND TRIGGERS
-- =============================================================================

-- Function to automatically create profile when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call handle_new_user function
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers to tables
create trigger handle_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.items
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.documents
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.bookings
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.expenses
  for each row execute procedure public.handle_updated_at();

-- Function to automatically create owner record when item is created
create or replace function public.handle_new_item()
returns trigger as $$
begin
  -- Add creator as 100% owner
  insert into public.item_owners (item_id, user_id, ownership_percentage, role)
  values (new.id, new.created_by, 100, 'owner');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call handle_new_item function
create trigger on_item_created
  after insert on public.items
  for each row execute procedure public.handle_new_item();

-- Function to automatically split expenses based on ownership
create or replace function public.create_expense_splits(expense_id uuid)
returns void as $$
declare
  expense_record record;
  owner_record record;
  split_amount decimal(10,2);
begin
  -- Get expense details
  select * into expense_record from public.expenses where id = expense_id;
  
  -- Handle different split methods
  if expense_record.split_method = 'equal' then
    -- Split equally among all owners
    select expense_record.amount / count(*) into split_amount
    from public.item_owners 
    where item_id = expense_record.item_id;
    
    -- Insert splits for each owner
    insert into public.expense_splits (expense_id, user_id, amount_owed)
    select expense_id, user_id, split_amount
    from public.item_owners 
    where item_id = expense_record.item_id;
    
  elsif expense_record.split_method = 'by_ownership' then
    -- Split based on ownership percentage
    insert into public.expense_splits (expense_id, user_id, amount_owed)
    select 
      expense_id, 
      user_id, 
      (expense_record.amount * ownership_percentage / 100)
    from public.item_owners 
    where item_id = expense_record.item_id;
  end if;
end;
$$ language plpgsql security definer;

-- =============================================================================
-- STORAGE BUCKETS
-- =============================================================================
-- Create storage buckets for files
insert into storage.buckets (id, name, public) 
values ('documents', 'documents', false);

insert into storage.buckets (id, name, public) 
values ('receipts', 'receipts', false);

insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true);

-- Storage policies
create policy "Users can view documents for items they own" on storage.objects
for select using (
  bucket_id = 'documents' and
  (storage.foldername(name))[1] in (
    select item_id::text from public.item_owners where user_id = auth.uid()
  )
);

create policy "Users can upload documents for items they own" on storage.objects
for insert with check (
  bucket_id = 'documents' and
  (storage.foldername(name))[1] in (
    select item_id::text from public.item_owners where user_id = auth.uid()
  )
);

-- Avatar policies
create policy "Avatar images are publicly accessible" on storage.objects
for select using (bucket_id = 'avatars');

create policy "Users can upload their own avatar" on storage.objects
for insert with check (
  bucket_id = 'avatars' and
  auth.uid()::text = (storage.foldername(name))[1]
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================
create index idx_profiles_email on public.profiles(email);
create index idx_items_created_by on public.items(created_by);
create index idx_items_status on public.items(status);
create index idx_item_owners_user_id on public.item_owners(user_id);
create index idx_item_owners_item_id on public.item_owners(item_id);
create index idx_documents_item_id on public.documents(item_id);
create index idx_bookings_item_id on public.bookings(item_id);
create index idx_bookings_booked_by on public.bookings(booked_by);
create index idx_bookings_dates on public.bookings(start_date, end_date);
create index idx_expenses_item_id on public.expenses(item_id);
create index idx_expenses_paid_by on public.expenses(paid_by);
create index idx_expense_splits_user_id on public.expense_splits(user_id);
create index idx_notifications_user_id on public.notifications(user_id);
create index idx_notifications_unread on public.notifications(user_id, read) where read = false;