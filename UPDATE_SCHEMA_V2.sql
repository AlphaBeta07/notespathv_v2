-- Add 'branch' column for materials table safely
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'materials' AND column_name = 'branch') THEN
        ALTER TABLE materials ADD COLUMN branch text;
    END IF;
END $$;

-- Also ensuring other columns exist just in case (safe to run multiple times)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'materials' AND column_name = 'subject') THEN
        ALTER TABLE materials ADD COLUMN subject text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'materials' AND column_name = 'semester') THEN
        ALTER TABLE materials ADD COLUMN semester text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'materials' AND column_name = 'module') THEN
        ALTER TABLE materials ADD COLUMN module text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'materials' AND column_name = 'college_details') THEN
        ALTER TABLE materials ADD COLUMN college_details text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'materials' AND column_name = 'uploader_name') THEN
        ALTER TABLE materials ADD COLUMN uploader_name text;
    END IF;
END $$;
