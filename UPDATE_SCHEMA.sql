-- Add new columns for enhanced metadata
alter table materials 
add column if not exists subject text,
add column if not exists semester text,
add column if not exists module text,
add column if not exists college_details text,
add column if not exists uploader_name text;

-- Optional: You might want to update the RLS policies if needed, but existing ones should cover new columns automatically for simple select/insert.
