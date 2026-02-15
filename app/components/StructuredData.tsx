'use client';

export default function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Personal Runway Calculator',
    description: 'Calculate your financial runway - how long you can survive without a job. Free tool for financial independence.',
    url: 'https://personal-runway-calculator.vercel.app',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '20',
      bestRating: '5',
      worstRating: '1',
    },
    author: {
      '@type': 'Person',
      name: 'May',
      jobTitle: 'Software Engineer',
    },
    featureList: [
      'Calculate personal runway in 30 seconds',
      'Track daily expenses',
      'Real-time runway updates',
      'What-if scenarios',
      'Cloud sync across devices',
      'Mobile-friendly',
      'Privacy-focused',
    ],
    screenshot: 'https://personal-runway-calculator.vercel.app/og-image.png',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
