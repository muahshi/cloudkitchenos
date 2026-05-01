import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-dm-sans",
  display: "swap",
});

// ── Base Metadata ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://cloudkitchenos.in"
  ),
  title: {
    default: "CloudKitchenOS — AI-Powered Cloud Kitchen Feasibility Platform",
    template: "%s | CloudKitchenOS",
  },
  description:
    "Start your cloud kitchen business with AI. Get a free feasibility score, SWOT analysis, and 12-month roadmap in 60 seconds. Built for Indian food entrepreneurs.",
  keywords: [
    "cloud kitchen",
    "ghost kitchen",
    "cloud kitchen india",
    "start cloud kitchen",
    "cloud kitchen feasibility",
    "swiggy zomato cloud kitchen",
    "fssai registration",
    "cloud kitchen business plan",
    "online food business india",
    "cloud kitchen software",
  ],
  authors: [{ name: "CloudKitchenOS" }],
  creator: "CloudKitchenOS",
  publisher: "CloudKitchenOS",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://cloudkitchenos.in",
    siteName: "CloudKitchenOS",
    title: "CloudKitchenOS — Start Your Cloud Kitchen with AI",
    description:
      "Answer 4 questions. Get a complete feasibility score, SWOT analysis, and 12-month roadmap — powered by Llama 3. Free.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CloudKitchenOS — AI Cloud Kitchen Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CloudKitchenOS — AI Cloud Kitchen Feasibility",
    description:
      "Start your cloud kitchen business with AI. Free feasibility score in 60 seconds.",
    images: ["/og-image.png"],
    creator: "@cloudkitchenos",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: "https://cloudkitchenos.in",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        {/* Structured data: Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "CloudKitchenOS",
              applicationCategory: "BusinessApplication",
              description:
                "AI-powered cloud kitchen feasibility and business planning platform for Indian entrepreneurs",
              offers: {
                "@type": "Offer",
                price: "1499",
                priceCurrency: "INR",
              },
              operatingSystem: "Web",
              url: "https://cloudkitchenos.in",
            }),
          }}
        />
      </head>
      <body
        className={`${dmSans.variable} font-sans bg-slate-950 text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
