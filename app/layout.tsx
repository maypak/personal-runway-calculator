import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Personal Runway Calculator - How Long Can You Survive Without a Job?",
  description: "Calculate your personal runway in seconds. Track savings, expenses, and know exactly how long you can survive without a job. Free financial independence calculator built by a 10-year engineer who quit.",
  keywords: ["runway calculator", "financial independence", "FIRE calculator", "burn rate", "savings calculator", "quit job", "financial freedom", "personal finance"],
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
    title: "Personal Runway Calculator - How Long Can You Survive Without a Job?",
    description: "Calculate your personal runway in seconds. Track savings, expenses, and know exactly how long you can survive without a job.",
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
    title: "Personal Runway Calculator - How Long Can You Survive Without a Job?",
    description: "Calculate your personal runway in seconds. Track savings, expenses, and know exactly how long you can survive without a job.",
    images: ['/og-image.png'],
    creator: '@personalrunway',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#8B5CF6',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
