-- Enable the UUID extension
create extension if not exists "uuid-ossp";

-- Ensure the table exists and has RLS enabled
alter table materials enable row level security;

-- Drop existing policies to clean up (Full Reset)
drop policy if exists "Users can view their own materials" on materials;
drop policy if exists "Users can insert their own materials" on materials;
drop policy if exists "Authenticated users can upload files" on storage.objects;
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Anyone can view materials" on materials;
drop policy if exists "Users can delete their own materials" on materials;

-- Re-create Table Policies

-- POLICY: Allow ANYONE (public) to view materials
create policy "Anyone can view materials"
  on materials for select
  to public
  using ( true );

-- POLICY: Users can insert their own materials
create policy "Users can insert their own materials"
  on materials for insert
  to authenticated
  with check ( auth.uid() = user_id );

-- POLICY: Users can delete their own materials
create policy "Users can delete their own materials"
  on materials for delete
  to authenticated
  using ( auth.uid() = user_id );

-- Storage Policies
insert into storage.buckets (id, name, public) 
values ('materials', 'materials', true)
on conflict (id) do nothing;

create policy "Authenticated users can upload files"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'materials' );

create policy "Public Access"
on storage.objects for select
to public
using ( bucket_id = 'materials' );

-- NOTE: Storage delete policy is often needed too if we want to cleanup files
create policy "Users can delete their own files"
on storage.objects for delete
to authenticated
using ( bucket_id = 'materials' AND owner = auth.uid() );
