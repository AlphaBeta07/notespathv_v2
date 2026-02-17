-- Create a table for materials
create table materials (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  file_url text not null,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table materials enable row level security;

-- Create a policy that allows users to view their own materials
create policy "Users can view their own materials"
  on materials for select
  using ( auth.uid() = user_id );

-- Create a policy that allows users to upload their own materials
create policy "Users can insert their own materials"
  on materials for insert
  with check ( auth.uid() = user_id );

-- STORAGE BUCKET POLICIES (You need to create a bucket named 'materials' first)

-- Create storage bucket 'materials'
participant
insert into storage.buckets (id, name, public) values ('materials', 'materials', true);

-- Policy to allow authenticated users to upload files
create policy "Authenticated users can upload files"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'materials' );

-- Policy to allow anyone to view files (since we set public=true)
-- keeping it simple for viewing
create policy "Public Access"
on storage.objects for select
to public
using ( bucket_id = 'materials' );
