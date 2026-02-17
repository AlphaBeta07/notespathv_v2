# Material Replica

A functional UI/UX replica of [getmaterial.vercel.app](https://getmaterial.vercel.app) built with React, Vite, Tailwind CSS, shadcn/ui, and Supabase.

## Tech Stack
- **Framework**: React + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: lucide-react
- **Animations**: framer-motion
- **Backend**: Supabase (Auth, Database, Storage)

## Setup Instructions

### 1. Supabase Setup
1.  Create a new project at [Supabase](https://supabase.com).
2.  Go to the **SQL Editor** and run the contents of `SCHEMA.sql` to create the database table and storage bucket policies.
    *   *Note: You might need to manually create the 'materials' bucket in the Storage dashboard if the SQL script fails on that part.*
3.  Go to **Project Settings > API** and copy your `Project URL` and `anon` public key.

### 2. Environment Variables
Create a file named `.env` in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install & Run
```bash
npm install
npm run dev
```

## Features
- **Auth**: Sign up and Login.
- **Dashboard**: View your uploaded materials.
- **Upload**: Upload files to Supabase Storage.
- **Landing**: Beautiful landing page.

## Deployment
This project is Vercel-ready.
1.  Push to GitHub.
2.  Import project in Vercel.
3.  Add the Environment Variables in Vercel settings.
4.  Deploy.
