import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";
import GoogleAnalytics from "@/components/google-analytics";
import CookieBanner from "@/components/cookie-banner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata = {
  title: {
    default:
      "Les Pros de Cherbourg - Actualités Tech, Mode, Voyage, Loisirs & Bien-être",
    template: "%s | Les Pros de Cherbourg",
  },
  description:
    "Découvrez les dernières actualités et conseils d'experts en technologie, mode et beauté, voyage, loisirs et santé bien-être. Votre source d'information à Cherbourg.",
  keywords: [
    "Cherbourg",
    "actualités",
    "technologie",
    "mode",
    "voyage",
    "loisirs",
    "santé",
    "bien-être",
    "conseils",
    "blog",
  ],
  authors: [{ name: "Les Pros de Cherbourg" }],
  creator: "Les Pros de Cherbourg",
  publisher: "Les Pros de Cherbourg",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://lesprosdecherbourg.fr"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Les Pros de Cherbourg",
    description:
      "Votre source d'information sur la technologie, la mode, les voyages, les loisirs et le bien-être",
    url: "https://lesprosdecherbourg.fr",
    siteName: "Les Pros de Cherbourg",
    images: [
      {
        url: "/images/og-image.jpg", // À créer
        width: 1200,
        height: 630,
        alt: "Les Pros de Cherbourg",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Les Pros de Cherbourg",
    description:
      "Votre source d'information sur la technologie, la mode, les voyages, les loisirs et le bien-être",
    images: ["/images/twitter-image.jpg"], // À créer
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
  // verification: {
  //   google: "ton-code-google-search-console", // À remettre après déploiement
  // },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Preconnect pour les performances */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
      </head>
      <body className="font-sans antialiased">
        {/* Google Analytics avec votre ID */}
        <GoogleAnalytics measurementId="G-5S911D29Y9" />

        {/* Bandeau cookies professionnel */}
        <CookieBanner />

        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
