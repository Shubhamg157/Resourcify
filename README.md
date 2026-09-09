# GapZero

> **Stop Studying Everything. Fix What's Broken.**  
> A targeted precision learning platform built for JEE aspirants that diagnoses the exact conceptual gap you have and prescribes the smallest possible recovery stack.

---

## 🎯 Key Features

- **Micro-Diagnostics**: 5-question adaptive assessments covering conceptual understanding, calculation, prerequisite application, and misconception triggers.
- **Root-Cause Prerequisite Graph**: Walks dependency trees (e.g. *Rolling Motion → Friction / Torque*) to detect the foundational gap causing higher-level confusion.
- **Precision Recovery Stack**:
  - Clear, intuitive concept breakdown
  - Key formulas and symbols
  - Curated, ranked resources (exact concept match, high credibility, priority ranking)
  - Interactive practice questions with immediate misconception feedback
- **Editorial Design System**: Custom back-to-school aesthetic with warm pearl, sand, crimson depth, and ruled lines.
- **Instant Skeleton Loading & Transitions**: Shimmer skeletons across every page and route transition for responsive feedback.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom editorial tokens & animations
- **Database**: [Prisma ORM](https://www.prisma.io/) with SQLite
- **AI Diagnostics**: Google Gemini AI SDK for structured JSON evaluations and root-cause prerequisite tracing
- **Typography**: Playfair Display (Headings), Inter (Body), JetBrains Mono (Numbers/Metrics)

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Shubhamg157/GapZero.git
cd GapZero
npm install
```

### 3. Environment Setup

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Set your Gemini API key:
```env
DATABASE_URL="file:./prisma/dev.db"
GEMINI_API_KEY="your-gemini-api-key-here"
```

### 4. Database Setup & Seeding

Push the schema and seed the knowledge graph:

```bash
npx prisma db push
npx prisma db seed
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
├── prisma/
│   ├── schema.prisma       # Knowledge graph, questions, and sessions schema
│   └── seed.ts             # Concepts, questions, and resources seed script
├── src/
│   ├── app/
│   │   ├── api/            # Diagnostic and recovery API routes
│   │   ├── diagnostic/     # Quiz and Gap Analysis results
│   │   ├── recovery/       # Personalized Recovery Stack
│   │   ├── topics/         # Subject & Topic drill-down selector
│   │   ├── globals.css     # Editorial theme, shimmer, and transition styles
│   │   ├── layout.tsx      # Root layout with top-progress indicator
│   │   └── loading.tsx     # Route-level skeleton loading fallbacks
│   ├── components/
│   │   ├── ui/skeleton.tsx # Reusable skeleton primitives & cards
│   │   └── NavigationProgress.tsx # Top loading transition bar
│   ├── lib/
│   │   ├── db.ts           # Prisma client singleton
│   │   ├── gemini.ts       # Gemini API client wrapper
│   │   └── services/       # Diagnostic, ranking & prerequisite engines
│   └── types/              # Shared TypeScript definitions
└── package.json
```

---

## 📜 License

MIT
