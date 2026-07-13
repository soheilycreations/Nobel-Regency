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
  title: "Nobel Regency Luxury Suite | Best Hotel in Kalutara, Sri Lanka",
  description:
    "A 5-star boutique hotel in Kalutara, Sri Lanka — ocean-view suites, private plunge pools, and personalised service minutes from Kalutara Beach and the Kalutara Bodhiya.",
  keywords: HOTEL.seoKeywords,
  openGraph: {
    title: "Nobel Regency Luxury Suite — Kalutara, Sri Lanka",
    description:
      "Golden luxury on the Kalutara coast. Book ocean-view suites and private suites directly.",
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
      "A 5-star boutique hotel in Kalutara, Sri Lanka offering ocean-view suites and private plunge pool accommodation.",
    address: {
      "@type": "PostalAddress",
      streetAddress: HOTEL.shortAddress,
      addressLocality: "Kalutara",
      addressCountry: "LK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: HOTEL.coordinates.lat,
      longitude: HOTEL.coordinates.lng,
    },
    starRating: { "@type": "Rating", ratingValue: "5" },
    priceRange: "LKR 28,000 - LKR 95,000",
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
