import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { siteUrl } from "@/lib/config";
import { icon } from "@/content/screens";

/**
 * Self-hosted via next/font: the CSS and woff2 files are served from our own
 * origin, so there is no render-blocking round trip to Google and no CLS from
 * a late swap. Only the weights the design actually uses are shipped.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

const title = "Vygor — Eat Better, Train Smarter, Lose the Weight";
const description =
  "Vygor is a super app for weight management and wellness, with human-driven AI tools for meal planning, exercise plans, recipes and macro tracking.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s — Vygor",
  },
  description,
  applicationName: "Vygor",
  keywords: [
    "wellness app",
    "meal planning",
    "macro tracker",
    "personalized workouts",
    "weight management",
    "healthy habits",
  ],
  authors: [{ name: "Vygor Health" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Vygor",
    title,
    description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Vygor — eat better, train smarter, lose the weight.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/opengraph-image"],
  },
  icons: {
    icon: [{ url: icon.src, type: "image/png" }],
    apple: [{ url: icon.src, sizes: "180x180" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "health",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#062231" },
  ],
  width: "device-width",
  initialScale: 1,
  // Pinch-zoom is left enabled on purpose — capping it is an accessibility bug.
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <head>
        {/* Scroll reveals start at opacity 0 and are un-hidden by an effect.
            With JavaScript off that effect never runs, so force every revealed
            block visible rather than shipping a blank page. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="antialiased">
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
