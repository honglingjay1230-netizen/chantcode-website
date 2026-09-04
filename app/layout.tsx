import type { Metadata } from "next";
import { SITE } from "./config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "ChantCode | Rhythm-Based Multiplication Fact Learning",
    template: "%s | ChantCode",
  },
  description:
    "ChantCode is a rhythm-based multiplication learning system for practicing multiplication facts and times tables, designed to support automatic recall.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "ChantCode",
    title: "ChantCode | Rhythm-Based Multiplication Fact Learning",
    description: "A rhythm-based multiplication learning system for practicing multiplication facts and times tables and supporting automatic recall.",
    url: "/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "ChantCode — Master Multiplication Through Rhythm" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChantCode - Multiplication Fact Fluency Through Rhythm and Memory",
    description: "Rhythmic multiplication chants and structured recall practice for children.",
    images: ["/og.png"],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ChantCode",
  url: SITE.url,
  description: "An English-language multiplication learning system using rhythmic verbal patterns to support multiplication fact recall.",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ChantCode",
  url: SITE.url,
  description: "An educational project developing a rhythm-based multiplication learning app for children.",
  email: SITE.supportEmail,
  logo: `${SITE.url}/chantcode-app-icon.png`,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        {children}
      </body>
    </html>
  );
}
