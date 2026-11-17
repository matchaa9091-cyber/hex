import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Footer from "@/components/Footer";
import React, { Suspense } from "react";
import PostHogPageview from "./posthog-pageview";

export const metadata: Metadata = {
  title: "Hex Escorts Uganda | Verified Companions",
  description:
    "Uganda Escorts: Browse 100% verified Ugandan call girls in Kampala, Entebbe, Jinja & Mbarara. Real photos, verified direct WhatsApp contacts & discreet hookups.",
  keywords: [
    "uganda escorts",
    "kampala escorts",
    "verified escorts uganda",
    "hex escorts",
    "call girls uganda",
    "vip escorts kampala"
  ],
  verification: {
    google: [
      "yK9CcPdgopgidQRXcgWNfzSD-LUmEUh3IXlMEJyZgDE",
      "CB2_zvrFVSNRXPIALZfpGR4eg2Gc8HQIgKh41BJd4OM",
      "37jbT2PcWcRwnnSmVcZxesfTuLLL5uyupKBsSed4pY4", 
      "JFY34OVLDSzS0ieEkEQAHauVc4__UBUFCT-8RYtIyuE",
      "-p0KFe2PgD4tXKEQ7tB5IS2OQ2bErUgDzWaq_W8JEO4"
    ],
  },
  icons: {
    icon: [
      { url: '/favicon-48x48.png', type: 'image/png', sizes: '48x48' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/icon.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon-48x48.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: "Hex Escorts Uganda | Verified Companions",
    description:
      "Browse 100% verified Ugandan call girls in Kampala, Entebbe, Jinja & Mbarara. Real photos, verified direct WhatsApp contacts & discreet hookups.",
    url: "https://www.hexescortsug.com/",
    siteName: "Hex Escorts Uganda",
    type: "website",
    locale: "en_UG",
    images: [
      {
        url: "https://www.hexescortsug.com/logo.png",
        width: 1024,
        height: 1024,
        alt: "Uganda Escorts - Hex Escorts UG Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hex Escorts Uganda | Verified Companions",
    description: "Browse 100% verified Ugandan call girls. Real photos, verified WhatsApp contacts & discreet hookups.",
    images: ["https://www.hexescortsug.com/logo.png"],
  },
  alternates: {
    canonical: "https://www.hexescortsug.com/",
  },
  metadataBase: new URL("https://www.hexescortsug.com/"),
};

const ROOT_SCHEMA_JSON = JSON.stringify([
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Hex Escorts Uganda",
    "url": "https://www.hexescortsug.com/",
    "image": "https://www.hexescortsug.com/logo.png"
  },
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Hex Escorts Uganda",
    "url": "https://www.hexescortsug.com/",
    "logo": "https://www.hexescortsug.com/logo.png",
    "image": "https://www.hexescortsug.com/logo.png",
    "description": "Uganda's #1 verified escort directory. Find discreet Uganda escorts, sexy call girls, and verified companions in Kampala, Entebbe, Jinja, Mbarara and countrywide.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "UG",
      "addressLocality": "Kampala"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Uganda"
    },
    "sameAs": [
      "https://x.com/vickywiz60",
      "https://t.me/+yX6mljCz8to2ODE0"
    ]
  }
]);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="geo.region" content="UG" />
        <meta name="geo.country" content="Uganda" />
        <meta name="language" content="English" />
        <meta name="theme-color" content="#FD2473" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon-48x48.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: ROOT_SCHEMA_JSON,
          }}
        />
      </head>
      <body suppressHydrationWarning className="overflow-x-hidden">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow overflow-x-hidden">{children}</main>
            <Footer />
          </div>
          <Suspense fallback={null}>
            <PostHogPageview />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}