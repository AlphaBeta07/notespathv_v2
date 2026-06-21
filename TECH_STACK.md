# 📚 NotesPathv — Tech Stack & Architecture Documentation

> A smart repository for engineering notes. Share, discover, and learn with peers from college.

---

## 🧩 Overview

**NotesPathv** is a full-stack web application that allows engineering students to upload, search, and view study materials (PDFs, DOCs, images). It features authenticated uploads, a rich filtering system, in-browser PDF preview, and WhatsApp sharing.

---

## 🛠️ Full Tech Stack

### ⚡ Frontend Framework

| Tool | Version | Purpose |
|------|---------|---------|
| **React** | `^18.3.1` | Core UI library (component-based rendering) |
| **TypeScript** | `^5.7.3` | Static typing, type safety across all components |
| **Vite** | `^6.1.0` | Build tool & local dev server (lightning-fast HMR) |

---

### 🎨 Styling & UI

| Tool | Version | Purpose |
|------|---------|---------|
| **TailwindCSS** | `^3.4.17` | Utility-first CSS framework for all layout & styling |
| **PostCSS** | `^8.5.1` | CSS transformation pipeline (used with Tailwind) |
| **Autoprefixer** | `^10.4.20` | Auto-adds vendor prefixes to CSS |
| **clsx** | `^2.1.1` | Conditional className utility |
| **tailwind-merge** | `^3.0.1` | Merges conflicting Tailwind classes safely |
| **class-variance-authority** | `^0.7.1` | Manages variant-based CSS classes for UI components |

---

### 🧱 UI Component Libraries

| Tool | Version | Purpose |
|------|---------|---------|
| **@radix-ui/react-avatar** | `^1.1.11` | Accessible avatar component (used in Profile) |
| **@radix-ui/react-label** | `^2.1.8` | Accessible form label component |
| **@radix-ui/react-slot** | `^1.2.4` | Render-as-child prop pattern (used in Button component) |
| **@radix-ui/react-toast** | `^1.2.1` | Toast notification system |
| **lucide-react** | `^0.475.0` | Icon library (Search, Upload, Share2, Trash2, etc.) |

---

### 🎞️ Animation

| Tool | Version | Purpose |
|------|---------|---------|
| **framer-motion** | `^12.4.2` | Declarative animations — fade-in, slide-up, spring hover lifts on cards |

Key animations used:
- `initial={{ opacity: 0, y: 20 }} → animate={{ opacity: 1, y: 0 }}` — Hero & form entry
- `whileHover={{ y: -5 }}` with spring stiffness on `MaterialCard`
- Staggered card grid rendering with `delay: index * 0.05`

---

### 🗄️ Backend & Database

| Tool | Version | Purpose |
|------|---------|---------|
| **Supabase** | `^2.48.1` | Backend-as-a-Service — Auth, PostgreSQL DB, File Storage |

#### Supabase Services Used:
- **Authentication** — Email/Password + Magic Link via `supabase.auth`
- **PostgreSQL Database** — `materials` table stores all note metadata
- **Storage Bucket** — `materials` bucket stores actual files (PDFs, images, DOCs)
- **Row Level Security (RLS)** — Policies ensure users can only manage their own data

---

### 📄 File & Document Handling

| Tool | Version | Purpose |
|------|---------|---------|
| **react-pdf** | `^10.3.0` | In-browser PDF rendering using `pdfjs-dist` worker |
| **html2pdf.js** | `^0.14.0` | Client-side HTML to PDF generation |
| **pdfjs-dist** | (via react-pdf) | PDF.js WebWorker for non-blocking parsing |

#### Office / Doc files rendering:
- **Microsoft Office Viewer** — `https://view.officeapps.live.com/op/embed.aspx?src=...`
- **Google Docs Viewer** — `https://docs.google.com/gview?url=...&embedded=true`

#### Supported file formats:
```
PDF | DOC | DOCX | JPG | JPEG | PNG | GIF | WEBP | SVG
```

---

### 🧭 Routing

| Tool | Version | Purpose |
|------|---------|---------|
| **react-router-dom** | `^7.1.5` | Client-side SPA routing |

#### Route Map:

```
/                  → Landing Page (public, search + browse notes)
/auth              → Login / Sign Up Page
/update-password   → Password Reset Page
/dashboard         → User Dashboard (protected)
/upload            → Upload Note Form (protected)
/profile           → User Profile (protected)
/material/:id      → View Individual Material (public)
```

---

### 📝 Markdown & Content Rendering

| Tool | Version | Purpose |
|------|---------|---------|
| **react-markdown** | `^10.1.0` | Renders markdown content in the UI |

---

### 🔐 Auth & State Management

| Mechanism | Details |
|-----------|---------|
| **AuthContext** | React Context API wrapping Supabase session state |
| **ProtectedRoute** | HOC — redirects to `/auth` if no active session |
| **ProtectedLayout** | Layout wrapper for all authenticated routes |
| **`useAuth()` hook** | Provides `user`, `session`, `signOut` across all components |

---

### ☁️ Deployment

| Tool | Purpose |
|------|---------|
| **Vercel** | Production deployment (`.vercel/` config present) |
| **Vite Build** | `tsc -b && vite build` — TypeScript compile + bundle |

---

## 🔍 Search & Filtering Technique

### How Search Works

The search system uses **linear scan filtering** (JavaScript `Array.filter()`) on an in-memory array. All materials are fetched **once** from Supabase on page load, then filtered entirely on the **client side** using `useEffect`.

```ts
// Landing.tsx — applyFilters()
const applyFilters = () => {
    let filtered = [...materials]              // shallow copy of full dataset

    // 1. Case-insensitive substring match
    if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filtered = filtered.filter(m =>
            m.subject?.toLowerCase().includes(query) ||
            m.title?.toLowerCase().includes(query) ||
            m.uploader_name?.toLowerCase().includes(query)
        )
    }
    // 2. Exact match filters
    if (selectedBranch)   filtered = filtered.filter(m => m.branch === selectedBranch)
    if (selectedModule)   filtered = filtered.filter(m => m.module === selectedModule)
    if (selectedSemester) filtered = filtered.filter(m => m.semester === selectedSemester)

    setFilteredMaterials(filtered)
}
```

### Search Algorithm Details

| Property | Detail |
|----------|--------|
| **Algorithm** | Linear Scan / Sequential Search — O(n) per filter pass |
| **Search Type** | Substring match (`.includes()`) — not exact, not fuzzy |
| **Case Handling** | Case-insensitive via `.toLowerCase()` on both query and data |
| **Trigger** | `useEffect` re-runs on every change to `searchQuery`, `selectedBranch`, `selectedModule`, `selectedSemester`, or `materials` |
| **Search Fields** | `title`, `subject`, `uploader_name` |
| **Filter Fields** | `branch` (exact), `module` (exact), `semester` (exact) |
| **Data Layer** | Fully client-side — no server-side search query is sent |

### Database-Level Ordering (Pre-sort)

Before data reaches the client, Supabase returns it **pre-sorted** using PostgreSQL's native `ORDER BY`:

```ts
.order('created_at', { ascending: false })  // newest first — DESC order
```

This is equivalent to **Insertion-Order Sort** descending by timestamp — materials are always shown newest-first.

---

### Subject Suggestions (Upload Form)

On the Upload page, subject suggestions use a **JavaScript `Set`** as a data structure:

```ts
let combinedSubjects = new Set<string>()
// 1. Add from predefined list
branchSubjects.forEach(s => combinedSubjects.add(s))
// 2. Add unique subjects from DB for the selected branch
data.forEach(item => { if (item.subject) combinedSubjects.add(item.subject) })
// 3. Convert to sorted array
setAvailableSubjects(Array.from(combinedSubjects).sort())  // Lexicographic sort
```

| Property | Detail |
|----------|--------|
| **Data Structure** | `Set<string>` — guarantees uniqueness |
| **Sorting** | JavaScript's native `.sort()` — Lexicographic (dictionary) order |
| **Sort Type** | Comparison sort — average O(n log n) |

---

## 📦 Data Storage & State Structures

### 1. React State (In-Memory / Component-level)

| State Variable | Type | Location | Structure |
|----------------|------|----------|-----------|
| `materials` | `Material[]` | `Landing.tsx`, `Dashboard.tsx` | Array of material objects |
| `filteredMaterials` | `Material[]` | `Landing.tsx` | Filtered subset array |
| `availableSubjects` | `string[]` | `Upload.tsx` | Sorted string array |
| `file` | `File \| null` | `Upload.tsx` | Browser `File` object |
| `user` | Supabase `User` | `AuthContext` | Supabase user object |
| `session` | Supabase `Session` | `AuthContext` | JWT session object |
| `isShareOpen` | `boolean` | `MaterialCard.tsx` | Modal visibility toggle |
| `pdfError` | `boolean` | `MaterialCard.tsx` | PDF load error flag |
| `numPages` | `number \| null` | `ViewMaterial.tsx` | PDF page count |

### 2. Queue / Stack Usage

> **Note:** This project does not explicitly use custom Queue or Stack data structures. However, equivalent LIFO/FIFO patterns are used implicitly:

| Pattern | Structure | Where | How |
|---------|-----------|-------|-----|
| **Upload Flow (LIFO-like)** | Stack-style callback chain | `Upload.tsx → handleUpload()` | Sequential async steps: validate → upload storage → get URL → insert DB → navigate |
| **Navigation History** | Browser History Stack | `useNavigate(-1)` in ViewMaterial | Goes back 1 step in the browser stack (LIFO) |
| **Set for dedup** | `Set<string>` | `Upload.tsx → fetchSubjects()` | Used like a bag/hash-set, not queue/stack |
| **Material list** | `Array` (LIFO display) | `Landing.tsx, Dashboard.tsx` | Newest materials come first (`.order('created_at', ascending: false)`) — functionally a stack display |

### 3. Supabase PostgreSQL Schema

```sql
CREATE TABLE materials (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  description      TEXT,
  file_url         TEXT NOT NULL,
  user_id          UUID REFERENCES auth.users NOT NULL,
  branch           TEXT,
  subject          TEXT,
  semester         TEXT,
  module           TEXT,
  college_details  TEXT,
  uploader_name    TEXT,
  created_at       TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);
```

### 4. File Storage

```
Supabase Storage Bucket: "materials"  (public = true)
Path structure: {user_id}/{random_id}_{timestamp}.{ext}

Example: a3b2c1d0-e.../9f3kx2_1745329200000.pdf
```

---

## 🗂️ Project Folder Structure

```
notespathv/
├── src/
│   ├── App.tsx                   # Root router & auth setup
│   ├── main.tsx                  # React DOM entry point
│   ├── index.css                 # Global styles + Tailwind directives
│   ├── components/
│   │   ├── DotBackground.tsx     # Animated dot grid background
│   │   ├── MaterialCard.tsx      # Note card with preview, share, delete
│   │   ├── ProtectedLayout.tsx   # Layout wrapper for auth routes
│   │   └── ui/                   # Radix-based shadcn/ui components
│   ├── context/
│   │   └── AuthContext.tsx       # Global auth state via React Context
│   ├── lib/
│   │   ├── supabase.ts           # Supabase client initialization
│   │   └── utils.ts              # cn() utility (clsx + tailwind-merge)
│   ├── pages/
│   │   ├── Landing.tsx           # Home + Search + Browse (public)
│   │   ├── Auth.tsx              # Login / Sign Up
│   │   ├── Dashboard.tsx         # User's uploaded materials
│   │   ├── Upload.tsx            # Upload form with validation
│   │   ├── Profile.tsx           # User profile management
│   │   ├── ViewMaterial.tsx      # Full material viewer (PDF/Image/Office)
│   │   └── UpdatePassword.tsx    # Password reset page
│   └── types/                    # TypeScript type definitions
├── SCHEMA.sql                    # Initial DB schema
├── UPDATE_SCHEMA.sql             # Schema migrations
├── FIX_RLS.sql                   # RLS policy fixes
├── package.json                  # Dependencies
├── vite.config.ts                # Vite configuration
├── tailwind.config.js            # Tailwind theme config
└── tsconfig.json                 # TypeScript config
```

---

## 📊 Summary Table

| Category | Technology |
|----------|------------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Styling** | TailwindCSS + Radix UI + shadcn/ui pattern |
| **Animations** | Framer Motion |
| **Routing** | React Router DOM v7 |
| **Backend/Auth** | Supabase (PostgreSQL + Auth + Storage) |
| **PDF Viewer** | react-pdf + pdfjs-dist |
| **Icons** | Lucide React |
| **Deployment** | Vercel |
| **Search Algorithm** | Linear Scan Filter — O(n), substring match |
| **Sort (DB)** | PostgreSQL `ORDER BY created_at DESC` |
| **Sort (Subjects)** | JS `.sort()` — Lexicographic, O(n log n) |
| **Dedup Structure** | `Set<string>` |
| **State Management** | React `useState` + Context API |
| **Data Store** | Supabase PostgreSQL + Supabase Storage |

---

*Generated: April 2026 | Project by Anish Landage*
