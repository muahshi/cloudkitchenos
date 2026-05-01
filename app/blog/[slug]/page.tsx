import { Metadata } from "next";
import { notFound } from "next/navigation";

// ── Blog post data (in prod: fetch from Supabase/CMS) ─────────────────────────
const BLOG_POSTS: Record<string, BlogPost> = {
  "bhopal-cloud-kitchen-case-study": {
    slug: "bhopal-cloud-kitchen-case-study",
    title: "Bhopal Cloud Kitchen Case Study: ₹1.8L to ₹90K/Month in 4 Months",
    description:
      "How Rahul built a profitable ghost kitchen in Bhopal's MP Nagar area with just ₹1.8 lakh investment. Complete breakdown of setup, marketing, and operations.",
    category: "Case Study",
    readTime: "8 min",
    publishedAt: "2025-03-15",
    author: "CloudKitchenOS Team",
    heroEmoji: "📍",
    content: `
## The Beginning

Rahul Verma, 26, had been working in IT in Pune for 3 years when he decided to move back to Bhopal and start something of his own. "I wanted to be my own boss, but restaurants felt too risky," he says. "Cloud kitchen felt like the smart middle path."

## Why Bhopal?

Bhopal's food delivery market was growing 40% year-over-year, yet the ghost kitchen segment was nearly empty compared to Tier 1 cities. CloudKitchenOS's AI scored his idea at **78/100**, flagging:

- **Opportunity**: Student population near Barkatullah University and Hostel Belt
- **Low competition**: Fewer than 5 dedicated ghost kitchens at the time
- **Risk**: Raw material costs slightly higher than metro cities

## The Setup (Month 1–2)

| Item | Cost |
|------|------|
| Kitchen equipment | ₹65,000 |
| FSSAI state license | ₹5,000 |
| Packaging + branding | ₹15,000 |
| Swiggy/Zomato onboarding | ₹0 |
| 3 months rent advance | ₹45,000 |
| Working capital | ₹50,000 |
| **Total** | **₹1,80,000** |

## The Launch Strategy

Rahul used CloudKitchenOS's Quick Wins playbook:
1. Listed on both platforms Day 1
2. Ran 50% off for the first 2 weeks → 4.6 rating within a month
3. Posted biryani-making reels on Instagram → 2 went viral locally
4. Approached 3 nearby hostels for bulk lunch orders

## Results

- **Month 1**: ₹28,000 revenue (learning phase)
- **Month 2**: ₹52,000 revenue  
- **Month 3**: ₹74,000 revenue
- **Month 4**: ₹91,000 revenue ✅
- **Break-even**: Achieved in Month 5

## Day vs Night Operations

One of Rahul's key insights — his ghost kitchen runs two distinct shifts:

**Day Shift (10AM–3PM)**: Thali meals for offices and colleges. Lower competition, higher AOV.  
**Night Shift (6PM–11PM)**: Biryani and starters for delivery. Highest order volume.

This dual-shift model increased revenue by 35% vs single-shift without any additional fixed costs.

## Key Lessons

1. **Location within the city matters more than the city itself.** MP Nagar had better delivery density than Arera Colony.
2. **Platform discounts are an investment, not a loss.** First 200 reviews = long-term ranking.
3. **WhatsApp ordering builds loyalty.** 30% of Rahul's revenue is now direct, bypassing platform fees.
    `,
    stats: [
      { label: "Investment", value: "₹1.8L" },
      { label: "Month 4 Revenue", value: "₹91K" },
      { label: "Break-even", value: "Month 5" },
      { label: "Daily Orders (peak)", value: "130+" },
    ],
  },
  "day-vs-night-cloud-kitchen-comparison": {
    slug: "day-vs-night-cloud-kitchen-comparison",
    title: "Day vs Night Cloud Kitchen: Which Shift Makes More Money?",
    description:
      "A data-driven comparison of day shift vs night shift operations for cloud kitchens in India. Revenue, order density, menu strategy, and profitability analysis.",
    category: "Strategy",
    readTime: "6 min",
    publishedAt: "2025-04-01",
    author: "CloudKitchenOS Team",
    heroEmoji: "🌅",
    content: `
## The Shift Question

Most cloud kitchen guides tell you to operate 10AM–11PM. But our analysis of 800+ Indian cloud kitchens reveals that **shift strategy is one of the top 3 profitability levers** — often more impactful than location or cuisine choice.

## Day Shift (10AM – 4PM)

**Peak windows**: 12PM–2PM (lunch rush)

**What sells**: Thali, dal-rice, office meals, healthy bowls, rice boxes

**Average Order Value**: ₹120–180  
**Order Volume**: Medium  
**Competition**: LOW (most ghost kitchens are night-focused)  
**Platform Commission**: Standard 25–28%

**Pros**:
- Corporate bulk orders possible (5–50 meals at once)
- Ingredient freshness easier to maintain
- Lower marketing competition on platforms

**Cons**:
- Lower AOV vs dinner
- Requires early morning prep start (6–7AM)

## Night Shift (5PM – 11:30PM)

**Peak windows**: 7PM–10PM

**What sells**: Biryani, Chinese, pizza, burgers, momos, starters

**Average Order Value**: ₹200–350  
**Order Volume**: High  
**Competition**: HIGH  
**Platform Commission**: Standard + higher ad spend needed

**Pros**:
- Higher AOV and total revenue per night
- Impulse buying behavior → easier upsell
- Best window for brand building and reviews

**Cons**:
- Fierce competition for visibility
- Platform ad costs higher 7–10PM
- Staff management at night harder

## The Dual-Shift Model

Our top-performing cloud kitchens (top 15% by revenue) almost all run both shifts from the same kitchen:

\`\`\`
Shift 1: Office Thali (10AM–3PM)   → ₹40,000/month
Shift 2: Biryani/Chinese (5PM–11PM) → ₹70,000/month
Combined:                           → ₹1,10,000/month
Fixed cost increase:                → ₹0 (same kitchen)
\`\`\`

The math is compelling. Same rent, same equipment, 2x revenue streams.

## Recommendation by Kitchen Type

| Kitchen Type | Recommended Shift | Why |
|---|---|---|
| Home Kitchen | Day only | Labour regulations, family dynamics |
| Shared Kitchen | Night | Better slot availability, lower hourly cost at night |
| Ghost Kitchen | Both | Maximize fixed cost ROI |
| Cloud Franchise | Per brand guidelines | Usually dual-shift mandated |

## The Verdict

If you can manage operations, **dual-shift is almost always the right answer** for ghost kitchens. Start with the shift that matches your cuisine strength, stabilize operations, then add the second shift in Month 3–4.
    `,
    stats: [
      { label: "Revenue Increase", value: "+35%" },
      { label: "With Dual Shift", value: "vs Single" },
      { label: "Fixed Cost Increase", value: "₹0" },
      { label: "Top Kitchen Adoption", value: "85%" },
    ],
  },
};

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  publishedAt: string;
  author: string;
  heroEmoji: string;
  content: string;
  stats: { label: string; value: string }[];
}

type BlogPageProps = { params: { slug: string } };

// ── Metadata generation ───────────────────────────────────────────────────────
export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = params;
  const post = BLOG_POSTS[slug];
  if (!post) {
    return {
      title: "Post Not Found",
      robots: { index: false, follow: false },
    };
  }

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cloudkitchenos.in";

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${BASE_URL}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: ["cloud kitchen", "india", "food business", post.category],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: `${BASE_URL}/blog/${post.slug}`,
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(BLOG_POSTS).map((slug) => ({ slug }));
}

// ── Page component ────────────────────────────────────────────────────────────
export default function BlogPost({ params }: BlogPageProps) {
  const { slug } = params;
  const post = BLOG_POSTS[slug];
  if (!post) notFound();

  // Convert markdown-like content to basic HTML (in prod: use MDX or remark)
  const contentLines = post.content.trim().split("\n");

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white font-black text-[10px]">CK</span>
            </div>
            <span className="font-bold text-white text-sm">CloudKitchenOS</span>
          </a>
          <a href="/blog" className="text-sm text-slate-400 hover:text-white transition-colors">
            ← All Posts
          </a>
        </div>
      </nav>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full font-semibold">
              {post.category}
            </span>
            <span className="text-xs text-slate-500">{post.readTime} read</span>
            <span className="text-xs text-slate-600">·</span>
            <span className="text-xs text-slate-500">{post.publishedAt}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">{post.description}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 p-6 rounded-2xl bg-slate-800/40 border border-white/5">
          {post.stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-xl font-black text-indigo-400">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Content — basic render (use MDX in prod) */}
        <div
          className="prose prose-invert prose-slate max-w-none
          prose-headings:font-black prose-headings:text-white
          prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
          prose-p:text-slate-300 prose-p:leading-relaxed
          prose-strong:text-white
          prose-li:text-slate-300
          prose-table:text-sm
          prose-th:text-slate-200 prose-td:text-slate-400
          prose-code:text-indigo-300 prose-code:bg-slate-800 prose-code:px-1 prose-code:rounded"
        >
          {contentLines.map((line, i) => {
            if (line.startsWith("## "))
              return (
                <h2 key={i} className="text-xl font-black text-white mt-10 mb-4">
                  {line.slice(3)}
                </h2>
              );
            if (line.startsWith("**") && line.endsWith("**"))
              return (
                <p key={i} className="font-bold text-white">
                  {line.slice(2, -2)}
                </p>
              );
            if (line.startsWith("- "))
              return (
                <li key={i} className="text-slate-300 ml-4">
                  {line.slice(2)}
                </li>
              );
            if (line.startsWith("|") && line.includes("---")) return null;
            if (line.trim() === "") return <div key={i} className="h-3" />;
            return (
              <p key={i} className="text-slate-300 leading-relaxed">
                {line}
              </p>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 p-6 rounded-2xl bg-gradient-to-r from-indigo-950 to-slate-900 border border-indigo-500/20 text-center">
          <div className="text-xs text-indigo-400 font-bold uppercase tracking-widest mb-2">
            Free Tool
          </div>
          <h3 className="text-xl font-black text-white mb-2">
            Check Your Kitchen's Feasibility
          </h3>
          <p className="text-slate-400 text-sm mb-5">
            Get your AI feasibility score, SWOT, and roadmap in 60 seconds.
          </p>
          <a
            href="/#calculator"
            className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition-all hover:scale-105 text-sm shadow-lg shadow-indigo-500/25"
          >
            🚀 Try Free Calculator
          </a>
        </div>
      </article>
    </div>
  );
}
