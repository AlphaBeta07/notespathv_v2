<div align="center">
  
# 📚 NotesPathv

**A smart, performant, and scalable repository for engineering study materials.**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square&logo=pwa)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

<p align="center">
  NotesPathv is a full-stack web application designed to empower engineering students by providing a centralized platform to upload, discover, and share academic resources. Built with modern web technologies, it delivers a lightning-fast, native-like experience across all devices.
</p>

</div>

---

## ✨ Key Features

- 🔐 **Secure Authentication:** Robust user authentication (Email/Password & Magic Links) powered by Supabase Auth and secured with Row Level Security (RLS).
- 📱 **Progressive Web App (PWA):** Fully installable on iOS, Android, and Desktop environments. Features an offline-ready application shell, intelligent caching via Workbox, and native-like app capabilities.
- 🔍 **Advanced Client-Side Search:** A highly optimized search and filtering engine (branch, module, semester) that runs entirely on the client for zero-latency discovery.
- 📄 **In-Browser Document Rendering:** Seamlessly view PDFs, DOCX files, and high-resolution images directly in the browser via `react-pdf` and integrated viewers.
- 📤 **Rich Uploads & Metadata:** Associate uploaded materials with detailed academic metadata to ensure accurate categorization and discoverability.
- 💬 **Social Integration:** One-click WhatsApp sharing capabilities to quickly distribute resources among peers.
- 🎨 **Modern, Accessible UI:** A responsive, glassmorphic design system utilizing **Tailwind CSS**, **Framer Motion** for fluid animations, and accessible **Radix UI** primitives.

---

## 🛠️ Architecture & Tech Stack

NotesPathv leverages a modern, decoupled architecture ensuring scalability and maintainability.

### Frontend
- **Core:** [React 18](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/) for strict type safety.
- **Build Tool:** [Vite](https://vitejs.dev/) for instantaneous HMR and optimized production bundling.
- **Routing:** [React Router v7](https://reactrouter.com/) for client-side navigation.
- **State Management:** React Context API & custom hooks.

### UI & UX
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with `clsx` and `tailwind-merge`.
- **Components:** [Radix UI](https://www.radix-ui.com/) & Shadcn/ui design patterns.
- **Icons & Animations:** [Lucide React](https://lucide.dev/) and [Framer Motion](https://www.framer.com/motion/).

### Backend & Infrastructure
- **BaaS Platform:** [Supabase](https://supabase.com/)
  - **PostgreSQL Database:** Relational data storage with robust RLS policies.
  - **Storage Buckets:** Cloud storage for uploaded PDFs and image assets.
  - **Authentication:** JWT-based secure session management.
- **PWA Tooling:** `vite-plugin-pwa` and Workbox for service worker generation and asset caching.

---

## 🗂️ Project Structure

```text
notespathv/
├── public/                 # Static assets & generated PWA icons
├── src/
│   ├── components/         # Reusable UI components (InstallPrompt, Cards, etc.)
│   ├── context/            # Global application state (AuthContext)
│   ├── lib/                # Utility functions & Supabase client initialization
│   ├── pages/              # Application views (Dashboard, Auth, Upload, etc.)
│   ├── types/              # TypeScript interfaces and global types
│   ├── App.tsx             # Root routing and component hierarchy
│   ├── main.tsx            # React DOM entry point
│   └── index.css           # Global stylesheets and Tailwind layers
├── SCHEMA.sql              # Core database schema definitions
├── UPDATE_SCHEMA.sql       # Iterative database migrations
├── FIX_RLS.sql             # Row Level Security policy configurations
└── vite.config.ts          # Vite & PWA plugin configurations
```

---

## 🚀 Getting Started

Follow these instructions to set up the project locally for development and testing.

### 1. Prerequisites
- **Node.js** (v18.x or higher)
- **npm** or **yarn**
- A [Supabase](https://supabase.com/) account and project.

### 2. Database Initialization
1. Navigate to the **SQL Editor** in your Supabase dashboard.
2. Execute the contents of `SCHEMA.sql` to provision the base tables.
3. Run `UPDATE_SCHEMA.sql` and `UPDATE_SCHEMA_V2.sql` to apply structural updates.
4. Execute `FIX_RLS.sql` to enforce correct security policies.
5. Create a new Storage Bucket named `materials` and ensure its visibility is set to **Public**.

### 3. Environment Configuration
Clone the repository and create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Installation & Local Development

```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

Navigate to `http://localhost:5173` in your browser to view the application.

---

## ☁️ Deployment

NotesPathv is built for seamless deployment on Edge networks like **Vercel** or **Netlify**.

1. Connect your GitHub repository to your preferred hosting provider.
2. Ensure the Build Command is set to `npm run build` and the Output Directory is `dist`.
3. Inject the following Environment Variables into the deployment settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy the application. The build process will automatically bundle the Progressive Web App assets and service workers.

---

<div align="center">
  <i>Engineered by Anish Landage</i>
</div>
