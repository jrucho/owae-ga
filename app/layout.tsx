import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://owae.ga";
const title = "owae.ga — Music, Visuals & Creative Tools";
const description =
  "The multimedia practice of Carlos Abeijón Martínez: music releases, live visuals, and browser-based creative tools from Lausanne and Galicia.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  authors: [{ name: "Carlos Abeijón Martínez", url: siteUrl }],
  creator: "Carlos Abeijón Martínez",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "owae.ga",
    title,
    description,
    images: [{
      url: "/owae-ga-social.jpg",
      width: 1200,
      height: 630,
      alt: "owae.ga — music, visuals and creative tools",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/owae-ga-social.jpg"],
  },
  icons: {
    icon: [{ url: "/favicon.svg?v=2026", type: "image/svg+xml" }],
    shortcut: "/favicon.svg?v=2026",
    apple: "/apple-touch-icon.png",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "owae.ga",
      description,
      inLanguage: "en",
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#carlos-abeijon-martinez`,
      name: "Carlos Abeijón Martínez",
      url: siteUrl,
      sameAs: [
        "https://owaega.bandcamp.com/",
        "https://open.spotify.com/artist/3CHA9jnHDxkhqaOvWoRWoJ",
        "https://www.instagram.com/owae.ga",
      ],
    },
    {
      "@type": "MusicAlbum",
      "@id": `${siteUrl}/#sofianima`,
      name: "SOFIÁNIMA",
      url: "https://owaega.bandcamp.com/album/sofi-nima",
      datePublished: "2026-05-15",
      image: `${siteUrl}/sofianima-cover.webp`,
      numTracks: 9,
      byArtist: { "@id": `${siteUrl}/#carlos-abeijon-martinez` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#browser-mastering`,
      name: "owae.ga Browser Mastering",
      url: `${siteUrl}/#master`,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any modern browser",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      author: { "@id": `${siteUrl}/#carlos-abeijon-martinez` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
