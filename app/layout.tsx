import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StructuredData from "./components/StructuredData";
import { Analytics } from '@vercel/analytics/react';
import { I18nProvider } from './contexts/I18nContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://personal-runway-calculator.vercel.app'),
  title: "Personal Runway Calculator - Your Money is TIME",
  description: "How much TIME do you have? Calculate your financial runway in 30 seconds. Know exactly how long you can chase your dreams. Free tool built by an engineer who quit after 10 years.",
  keywords: ["runway calculator", "financial independence", "FIRE calculator", "burn rate", "time is money", "quit job", "financial freedom", "savings tracker", "personal finance", "how long can I survive", "money runway"],
  authors: [{ name: "Personal Runway Calculator" }],
  creator: "Personal Runway Calculator",
  publisher: "Personal Runway Calculator",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://personal-runway-calculator.vercel.app',
    title: "Personal Runway Calculator - Your Money is TIME",
    description: "How much TIME do you have to chase your dream? Calculate your financial runway in 30 seconds. Built by an engineer who quit after 10 years.",
    siteName: 'Personal Runway Calculator',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Personal Runway Calculator - Financial Freedom Tracker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Personal Runway Calculator - Your Money is TIME",
    description: "How much TIME do you have to chase your dream? Calculate your runway in 30 seconds. Free tool for dreamers, builders, and future quitters.",
    images: ['/og-image.png'],
    creator: '@personalrunway',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#8B5CF6',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider>
          {children}
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  );
}
