# ☁️ CloudKitchenOS

> AI-powered cloud kitchen feasibility platform for Indian food entrepreneurs.  
> Built with Next.js 15, Supabase, and Groq (Llama 3).

![CloudKitchenOS Banner](./public/og-image.png)

---

## 🗂️ Project Structure

```
cloudkitchenos/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # Groq AI analysis endpoint
│   ├── blog/
│   │   └── [slug]/
│   │       └── page.tsx          # SEO-optimized blog posts
│   ├── globals.css               # Tailwind + design tokens
│   ├── layout.tsx                # Root layout + metadata
│   ├── page.tsx                  # Landing page + Calculator
│   ├── robots.ts                 # Robots.txt generation
│   └── sitemap.ts                # Dynamic sitemap
│
├── components/                   # (Add shared UI components here)
│   └── ui/                       # Shadcn components
│
├── hooks/
│   └── useCalculator.ts          # Multi-step calculator state logic
│
├── lib/
│   └── supabase.ts               # Supabase client + helpers (RLS)
│
├── types/
│   └── database.ts               # TypeScript DB types + domain models
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # DB schema + RLS policies
│
├── .env.example                  # Environment template
├── next.config.ts                # Next.js config + security headers
├── tailwind.config.ts            # Design system tokens
└── package.json
```

---

## 🚀 Quick Start

### 1. Clone and install

```bash
git clone https://github.com/yourname/cloudkitchenos
cd cloudkitchenos
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
# Fill in your Supabase and Groq API keys
```

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → New query
3. Paste and run `supabase/migrations/001_initial_schema.sql`
4. Copy your Project URL and anon key into `.env.local`

### 4. Get Groq API key

1. Go to [console.groq.com](https://console.groq.com)
2. Create an API key
3. Add to `.env.local` as `GROQ_API_KEY`

### 5. Run development server

```bash
npm run dev
# Open http://localhost:3000
```

---

## 🏗️ Architecture

### AI Analysis Flow

```
User fills 4-step Calculator
    ↓
POST /api/analyze
    ↓
Rate limit check (5 req/min per IP)
    ↓
Groq SDK → llama3-70b-8192
    ↓
JSON response: score, SWOT, roadmap
    ↓
Typewriter animation reveal
```

### Database Security (RLS)

All database operations use Supabase Row Level Security:

```sql
-- Users can ONLY see their own kitchen data
CREATE POLICY "kitchens: users read own"
  ON public.kitchens FOR SELECT
  USING (auth.uid() = user_id);
```

Two client types:
- **`supabase`** (anon key) — browser, RLS enforced
- **`supabaseAdmin`** (service role) — server actions only, bypasses RLS

### API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/analyze` | POST | Groq AI kitchen analysis |

**Request body:**
```json
{
  "input": {
    "location": "Bhopal",
    "budget": 180000,
    "kitchenType": "ghost_kitchen",
    "cuisine": "Biryani"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "feasibilityScore": 78,
    "verdict": "Highly Feasible",
    "summary": "...",
    "swot": { "strengths": [...], "weaknesses": [...], ... },
    "roadmap": [{ "phase": 1, "title": "Setup", ... }],
    "estimatedMonthlyRevenue": "₹85K–₹1.2L",
    "estimatedBreakeven": "5–7 months",
    "keyRisks": [...],
    "quickWins": [...]
  }
}
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `slate-950` (#0f172a) |
| Primary accent | Indigo 600 (#6366f1) |
| Success/growth | Emerald 500 (#10b981) |
| Warning/risk | Amber 500 (#f59e0b) |
| Font (body) | DM Sans |
| Font (display) | Sora |

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `next` 15 | App Router, server actions |
| `@supabase/supabase-js` v2 | DB, Auth, Storage |
| `groq-sdk` | Llama 3 inference |
| `tailwindcss` + `@tailwindcss/typography` | Styling |
| `framer-motion` | Animations (typewriter, etc.) |
| `lucide-react` | Icons |

---

## 🔒 Security Checklist

- [x] RLS enabled on all tables
- [x] Service role key never exposed to browser
- [x] Rate limiting on `/api/analyze` (5 req/min)
- [x] Input validation on all API routes
- [x] Security headers (X-Frame-Options, CSP, etc.)
- [x] No sensitive data in client-side state

---

## 📝 Blog System

Blog posts live in `app/blog/[slug]/page.tsx`. Each post:
- Has dynamic `generateMetadata()` for SEO
- Generates static paths via `generateStaticParams()`
- Includes structured data (JSON-LD)
- Has canonical URLs

**Published posts:**
- `/blog/bhopal-cloud-kitchen-case-study`
- `/blog/day-vs-night-cloud-kitchen-comparison`

---

## 💳 Pricing

| Plan | Price | Features |
|------|-------|---------|
| Free | ₹0 | AI Score, SWOT, Roadmap |
| PRO | ₹1,499 one-time | + FSSAI Guide, GST Guide, Vendor DB, Financial Model, Case Studies |

---

## 🚢 Deployment

### Vercel (recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Add all environment variables in Vercel Dashboard → Project → Settings → Environment Variables.

---

## 📄 License

MIT © 2025 CloudKitchenOS
