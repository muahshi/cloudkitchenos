import Link from "next/link";

const FOOTER_LINKS = {
  Resources: [
    { label: "Bhopal Case Study", href: "/blog/bhopal-cloud-kitchen-case-study" },
    { label: "FSSAI Guide", href: "/blog/fssai-registration-guide-cloud-kitchen" },
    { label: "GST for Cloud Kitchens", href: "/blog/gst-setup-cloud-kitchen-india" },
    { label: "Day vs Night Kitchen", href: "/blog/day-vs-night-cloud-kitchen-comparison" },
    { label: "Swiggy/Zomato Guide", href: "/blog/swiggy-zomato-listing-guide" },
  ],
  Product: [
    { label: "Free Calculator", href: "/#calculator" },
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/blog" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refunds" },
  ],
};

const COMPLIANCE_ITEMS = [
  "FSSAI Registration",
  "GST Setup",
  "Fire NOC",
  "Trade License",
  "Shop & Est. Act",
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <span className="text-white font-black text-xs">CK</span>
              </div>
              <span className="font-black text-white text-sm tracking-tight">
                CloudKitchenOS
              </span>
            </Link>
            <p className="text-slate-500 text-xs leading-relaxed max-w-xs mb-5">
              India's first AI-powered cloud kitchen feasibility and planning platform. Built for the next generation of food entrepreneurs.
            </p>

            {/* Compliance chips */}
            <div className="mb-5">
              <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-2">
                Compliance Coverage
              </div>
              <div className="flex flex-wrap gap-1.5">
                {COMPLIANCE_ITEMS.map((item) => (
                  <span
                    key={item}
                    className="text-[10px] text-slate-500 bg-slate-800/60 border border-white/5 px-2 py-0.5 rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-3">
              {["Twitter", "Instagram", "LinkedIn", "YouTube"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-xs text-slate-600 hover:text-slate-300 transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                {section}
              </div>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-slate-500 hover:text-slate-200 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FSSAI/GST Guide preview (trust signal) */}
        <div className="border border-amber-500/15 bg-amber-500/5 rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">📋</span>
            <div>
              <div className="text-xs font-bold text-amber-400 mb-0.5">
                FSSAI + GST Compliance Guide
              </div>
              <div className="text-xs text-slate-500 leading-relaxed">
                Step-by-step guide for FSSAI basic/state/central registration + GST setup — included in PRO.
              </div>
            </div>
          </div>
          <Link
            href="/pricing"
            className="flex-shrink-0 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-all whitespace-nowrap"
          >
            Unlock PRO — ₹1,499
          </Link>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-white/5">
          <div className="text-xs text-slate-600">
            © {new Date().getFullYear()} CloudKitchenOS · Made with ☕ for Indian food entrepreneurs
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-700">Powered by</span>
            <span className="text-xs text-slate-600 font-medium">Llama 3 · Supabase · Next.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
