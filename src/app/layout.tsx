import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", 
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === 'production'
      ? 'https://donishyob.com'
      : 'http://localhost:3000'
  ),
  title: 'DonishYob — Научная онлайн библиотека китобҳо',
  description: 'Донишёб — платформаи илмӣ ва китобхонаи онлайн барои донишҷӯён ва муҳаққиқон. Китобҳои илмӣ, дарсӣ ва маводҳои таълимиро бо забонҳои тоҷикӣ ва русӣ пайдо кунед.',
  keywords: [
    "Донишёб", "DonishYob", "донишёб", "donishyob",
    "китобхонаи онлайн", "научная библиотека", "скачать книги",
    "китобҳои тоҷикӣ", "библиотека Таджикистан", "маводҳои таълимӣ"
  ],
  verification: {
    google: 'bUAg_aGiAfu-hWYycirF3qRLTGAoLWTkcJxXlFbENH8',
  },
  authors: [{ name: 'DonishYob Team' }],
  openGraph: {
    title: 'DonishYob — Поиск научных материалов',
    description: 'Научная библиотека с широким выбором учебных материалов.',
    url: 'https://donishyob.com',
    siteName: 'DonishYob',
    images: [
      {
        url: "https://donishyob.com/donishyob.png",
        width: 1200,
        height: 630,
        alt: "Намуди зоҳирии DonishYob",
      },
    ],
    locale: 'tg_TJ',
    type: 'website',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'DonishYob — Научная онлайн библиотека',
    description: 'Научная библиотека с широким выбором учебных материалов.',
    images: ['https://donishyob.com/donishyob.png'],
  },
  icons: {
    icon: "https://donishyob.com/donishyob.png",
    shortcut: "https://donishyob.com/donishyob.png",
    apple: "https://donishyob.com/donishyob.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
