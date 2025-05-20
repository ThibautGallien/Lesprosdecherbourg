import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/header';
import Footer from '@/components/footer';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Les Pros de Cherbourg - Blog Lifestyle, Technologie et Bien-être',
  description: 'Découvrez les dernières tendances en technologie, mode et beauté, voyage, loisirs, santé et bien-être sur Les Pros de Cherbourg.',
  keywords: 'blog, lifestyle, technologie, mode, beauté, voyage, loisirs, santé, bien-être, Cherbourg',
  authors: [{ name: 'Les Pros de Cherbourg' }],
  openGraph: {
    title: 'Les Pros de Cherbourg - Blog Lifestyle, Technologie et Bien-être',
    description: 'Découvrez les dernières tendances en technologie, mode et beauté, voyage, loisirs, santé et bien-être sur Les Pros de Cherbourg.',
    url: 'https://lesprosdecherbourg.fr',
    siteName: 'Les Pros de Cherbourg',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Les Pros de Cherbourg - Blog Lifestyle, Technologie et Bien-être',
    description: 'Découvrez les dernières tendances en technologie, mode et beauté, voyage, loisirs, santé et bien-être.',
  },
  metadataBase: new URL('https://lesprosdecherbourg.fr'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="lpdc">
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}