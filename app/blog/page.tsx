import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — Cloud Kitchen Guides, Case Studies & Strategy",
  description:
    "In-depth guides, real case studies, and strategies for starting and scaling a cloud kitchen business in India. FSSAI, Swiggy/Zomato, and more.",
  alternates: {
    canonical: "https://cloudkitchenos.in/blog",
  },
};

const POSTS = [
  {
    slug: "bhopal-cloud-kitchen-case-study",
    title: "₹1.8L to ₹90K/Month: The Bhopal Ghost Kitchen Story",
    description:
      "How Rahul built a profitable biryani ghost kitchen in Bhopal with a lean budget and smart Swiggy/Zomato strategy.",
    category: "Case Study",
    readTime: "8 min",
    date: "2025-03-15",
    emoji: "📍",
    featured: true,
    stats: ["₹1.8L investment", "Month 4: ₹91K revenue", "Score: 78/100"],
  },
  {
    slug: "day-vs-night-cloud-kitchen-comparison",
    title: "Day vs Night Cloud Kitchen: Which Shift Makes More Money?",
    description:
      "Data-driven breakdown of shift strategy across 800+ Indian cloud kitchens. The dual-shift model explained.",
    category: "Strategy",
    readTime: "6 min",
    date: "2025-04-01",
    emoji: "🌅",
    featured: false,
    stats: ["+35% revenue", "Same fixed costs", "85% top kitchens use it"],
  },
  {
    slug: "fssai-registration-guide-cloud-kitchen",
    title: "FSSAI Registration for Cloud Kitchens: Complete 2025 Guide",
    description:
      "Step-by-step walkthrough of FSSAI basic, state, and central registration. Costs, timelines, and common mistakes.",
    category: "Compliance",
    readTime: "7 min",
    date: "2025-02-20",
    emoji: "📋",
    featured: false,
    stats: ["₹100–₹7,500", "7–30 days", "Mandatory for all"],
  },
  {
    slug: "gst-setup-cloud-kitchen-india",
    title: "GST for Cloud Kitchens: Do You Actually Need It?",
    description:
      "When GST registration becomes mandatory, how to file, and what the 5% restaurant rate means for your margins.",
    category: "Compliance",
    readTime: "5 min",
    date: "2025-02-28",
    emoji: "📊",
    featured: false,
    stats: ["₹20L threshold", "5% rate", "Input credit rules"],
  },
  {
    slug: "swiggy-zomato-listing-guide",
    title: "How to Rank Higher on Swiggy & Zomato (2025 Algorithm Guide)",
    description:
      "The exact tactics top cloud kitchens use to improve their platform ranking, ratings, and order velocity.",
    category: "Marketing",
    readTime: "9 min",
    date: "2025-04-10",
    emoji: "🚀",
    featured: false,
    stats: ["25–30% commission", "Rating strategy", "Ad spend playbook"],
  },
  {
    slug: "ghost-kitchen-investment-guide",
    title: "How Much Does a Ghost Kitchen Actually Cost in India?",
    description:
      "Realistic cost breakdown for setting up a ghost kitchen across Tier 1, 2, and 3 Indian cities.",
    category: "Finance",
    readTime: "6 min",
    date: "2025-03-05",
    emoji: "💰",
    featured: false,
    stats: ["₹50K–₹5L range", "City-wise data", "ROI calculator"],
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Case Study": "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  Strategy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Compliance: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Marketing: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  Finance: "text-blue-400 bg-blue-500/10 border-blue-500/20",
};

function CategoryBadge({ category }: { category: string }) {
  const style = CATEGORY_COLORS[category] ?? "text-slate-400 bg-slate-500/10 border-slate-500/20";
  return (
    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${style}`}>
      {category}
    </span>
  );
}

export default function BlogIndexPage() {
  const featured = POSTS.find((p) => p.featured)!;
  const rest = POSTS.filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-indigo-600/6 rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="border-b border-white/5 px-4 py-4 relative z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white font-black text-[10px]">CK</span>
            </div>
            <span className="font-bold text-white text-sm">CloudKitchenOS</span>
          </Link>
          <Link
            href="/#calculator"
            className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg transition-all"
          >
            Free Calculator →
          </Link>
        </div>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-xs text-indigo-400 font-bold uppercase tracking-widest mb-3">
            Cloud Kitchen Academy
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Guides, Case Studies & Strategy
          </h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Real-world playbooks for Indian food entrepreneurs. No fluff — just what works.
          </p>
        </div>

        {/* Featured post */}
        <Link href={`/blog/${featured.slug}`} className="block group mb-8">
          <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/20 hover:border-indigo-500/40 rounded-2xl p-6 sm:p-8 transition-all hover:shadow-xl hover:shadow-indigo-500/10">
            <div className="flex items-start gap-4">
              <div className="text-4xl sm:text-5xl">{featured.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <CategoryBadge category={featured.category} />
                  <span className="text-xs text-slate-500">{featured.readTime} read</span>
                  <span className="text-xs text-indigo-400/60 bg-indigo-500/8 border border-indigo-500/15 px-2 py-0.5 rounded-full font-semibold">
                    Featured
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-indigo-200 transition-colors mb-2">
                  {featured.title}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {featured.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {featured.stats.map((stat) => (
                    <span
                      key={stat}
                      className="text-xs text-emerald-400 bg-emerald-500/8 border border-emerald-500/15 px-2.5 py-1 rounded-full font-medium"
                    >
                      {stat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Post grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <div className="h-full bg-slate-800/40 border border-white/5 hover:border-indigo-500/20 rounded-2xl p-5 transition-all hover:shadow-lg hover:shadow-indigo-500/5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="text-3xl">{post.emoji}</span>
                  <CategoryBadge category={post.category} />
                </div>
                <h3 className="font-bold text-white text-sm leading-tight group-hover:text-indigo-200 transition-colors mb-2">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">
                  {post.description}
                </p>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                  <span className="text-xs text-slate-600">{post.readTime} read</span>
                  <span className="text-xs text-indigo-400 font-medium group-hover:translate-x-0.5 transition-transform inline-block">
                    Read →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center p-8 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/20">
          <div className="text-xs text-indigo-400 font-bold uppercase tracking-widest mb-2">
            Free Tool
          </div>
          <h3 className="text-xl font-black text-white mb-2">
            Check Your Kitchen's Feasibility
          </h3>
          <p className="text-slate-400 text-sm mb-5">
            Get AI-powered score, SWOT analysis, and 12-month roadmap in 60 seconds.
          </p>
          <Link
            href="/#calculator"
            className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all hover:scale-105 shadow-lg shadow-indigo-500/25"
          >
            🚀 Try Free Calculator
          </Link>
        </div>
      </div>
    </div>
  );
}
