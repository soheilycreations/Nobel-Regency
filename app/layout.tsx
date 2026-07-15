import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "./providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { HOTEL } from "@/lib/rooms-data";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nobel Regency Hotel | Best Hotel in Bibile, Sri Lanka",
  description:
    "A garden guest house in Bibile, Sri Lanka, 46 km from Maduru Oya National Park — antique-filled rooms, a peaceful garden, a family cottage, and a quiet meditation retreat. Daily continental, Asian, and vegetarian breakfast options.",
  keywords: HOTEL.seoKeywords,
  openGraph: {
    title: "Nobel Regency Hotel — Bibile, Sri Lanka",
    description:
      "A garden bungalow hotel in Bibile with antique-filled rooms, organic food, and a peaceful meditation retreat. Book directly.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const hotelSchema = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: HOTEL.name,
    description:
      "A garden bungalow hotel in Bibile, Sri Lanka, with antique-filled rooms, a family cottage, and a peaceful meditation retreat.",
    address: {
      "@type": "PostalAddress",
      streetAddress: HOTEL.shortAddress,
      addressLocality: "Bibile",
      addressRegion: "Uva Province",
      addressCountry: "LK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: HOTEL.coordinates.lat,
      longitude: HOTEL.coordinates.lng,
    },
    sameAs: [HOTEL.facebookUrl, HOTEL.bookingComUrl],
    priceRange: "LKR 8,500 - LKR 15,500",
  };

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelSchema) }}
        />
        <QueryProvider>
          <Navbar />
          {children}
          <Footer />
          <WhatsAppButton />
        </QueryProvider>
      </body>
    </html>
  );
}
