# 📚 NotesPathv

<<<<<<< HEAD
A functional UI/UX built with React, Vite, Tailwind CSS, shadcn/ui, and Supabase.
=======
> A smart repository for engineering notes. Share, discover, and learn with peers from college.
>>>>>>> 0976d1d (updated)

**NotesPathv** is a full-stack web application that allows engineering students to upload, search, and view study materials (PDFs, DOCs, images). It features authenticated uploads, a rich filtering system, in-browser PDF preview, and WhatsApp sharing.

## ✨ Features

- **Authentication:** Secure Email/Password & Magic Link login via Supabase Auth.
- **Rich Uploads:** Upload study materials (PDF, DOC, DOCX, Images) with metadata like branch, subject, and semester.
- **Advanced Search & Filtering:** Case-insensitive substring matching and exact filtering by branch, module, and semester, completely on the client side for lightning-fast performance.
- **In-Browser Document Preview:** Read PDFs and Office files directly in your browser without downloading.
- **User Dashboard:** Manage and organize your uploaded materials.
- **WhatsApp Sharing:** One-click sharing of study materials with peers.
- **Responsive Design:** Beautiful, dynamic UI built with TailwindCSS, Framer Motion, and Radix UI components.

## 🛠️ Tech Stack

- **Frontend Framework:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, PostCSS, clsx, tailwind-merge
- **UI Components:** Radix UI, shadcn/ui style patterns, lucide-react (Icons)
- **Animations:** Framer Motion
- **Routing:** React Router DOM v7
- **Backend & Database:** Supabase (PostgreSQL Database, Auth, Storage Bucket)
- **Document Rendering:** react-pdf, html2pdf.js

## 🗂️ Project Structure

```text
notespathv/
├── src/
│   ├── App.tsx                   # Root router & auth setup
│   ├── index.css                 # Global styles + Tailwind directives
│   ├── components/               # Reusable UI components (MaterialCard, etc.)
│   ├── context/                  # React Context (AuthContext)
│   ├── lib/                      # Utilities (Supabase client, clsx/twMerge)
│   ├── pages/                    # Route pages (Landing, Auth, Dashboard, etc.)
│   └── types/                    # TypeScript definitions
├── SCHEMA.sql                    # Initial DB schema
├── UPDATE_SCHEMA*.sql            # Schema migrations
├── FIX_RLS.sql                   # RLS policy fixes
├── .env                          # Environment variables
└── package.json                  # Dependencies
```

## 🚀 Setup Instructions

### 1. Prerequisites

- Node.js (v18+ recommended)
- A Supabase account ([supabase.com](https://supabase.com))

### 2. Supabase Setup

1. Create a new project in Supabase.
2. Navigate to the **SQL Editor** in your Supabase dashboard.
3. Run the contents of `SCHEMA.sql` to initialize the database tables.
4. Run `UPDATE_SCHEMA.sql` and `UPDATE_SCHEMA_V2.sql` to apply schema migrations.
5. Run `FIX_RLS.sql` to configure Row Level Security (RLS) policies.
6. Create a new Storage Bucket named `materials` and ensure it's set to **Public**.

### 3. Environment Variables

Create a `.env` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Installation & Local Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be running at `http://localhost:5173`.

## ☁️ Deployment

NotesPathv is optimized for deployment on Vercel:

1. Push your code to GitHub.
2. Import the repository into Vercel.
3. Add the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to Vercel's Environment Variables settings.
4. Click **Deploy**.

---
*Created by Anish Landage*
