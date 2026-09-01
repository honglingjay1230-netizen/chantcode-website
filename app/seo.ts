import type { Metadata } from "next";
import { SITE } from "./config";

const socialImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "ChantCode — Master Multiplication Through Rhythm",
};

export function createPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
}): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "ChantCode",
      title,
      description,
      url: path,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage.url],
    },
  };
}

export function createArticleJsonLd({
  headline,
  description,
  path,
  datePublished,
  dateModified,
}: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    datePublished,
    dateModified,
    mainEntityOfPage: `${SITE.url}${path}`,
    author: {
      "@type": "Organization",
      name: "ChantCode",
      url: SITE.url,
    },
    publisher: {
      "@type": "Organization",
      name: "ChantCode",
      url: SITE.url,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.url}/chantcode-app-icon.png`,
      },
    },
  };
}
