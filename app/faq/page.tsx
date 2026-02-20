'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Home, HelpCircle, Shield, Zap, Database, Calendar } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'getting-started' | 'features' | 'privacy' | 'technical' | 'beta';
}

const faqs: FAQItem[] = [
  // Getting Started
  {
    question: 'What is Personal Runway?',
    answer: 'Personal Runway is a financial planning tool that helps you understand how long your money will last. It calculates your "runway" - the number of months you can survive on your current savings before running out of money.',
    category: 'getting-started'
  },
  {
    question: 'How do I calculate my runway?',
    answer: 'Simply enter your current savings and monthly expenses. The app will instantly show you how many months your money will last. You can refine the calculation by adding income, one-time expenses, and more.',
    category: 'getting-started'
  },
  {
    question: 'Do I need to create an account?',
    answer: 'Yes, an account is required to save your data and access it from any device. We offer email sign-up or you can use Google/GitHub for quick access.',
    category: 'getting-started'
  },
  {
    question: 'Is this app free?',
    answer: 'Yes! Personal Runway is 100% free during beta. We may introduce premium features in the future, but the core runway calculation will always be free.',
    category: 'getting-started'
  },

  // Features
  {
    question: 'What is the difference between fixed and variable expenses?',
    answer: 'Fixed expenses are consistent monthly costs (rent, insurance, subscriptions). Variable expenses change month-to-month (food, entertainment, shopping). Separating them helps you understand your baseline needs vs flexible spending.',
    category: 'features'
  },
  {
    question: 'Can I track multiple income sources?',
    answer: 'Currently, you can track one monthly income source and specify how many months you expect to receive it (e.g., freelance contract, unemployment benefits). Multiple income tracking is coming in a future update!',
    category: 'features'
  },
  {
    question: 'What are Scenarios?',
    answer: 'Scenarios let you compare different financial situations side-by-side (e.g., "Quit job" vs "Stay employed"). You can add one-time expenses, recurring income changes, and see how each scenario affects your runway.',
    category: 'features'
  },
  {
    question: 'What is FIRE and how does it work?',
    answer: 'FIRE (Financial Independence, Retire Early) is a movement focused on saving aggressively to retire early. Our FIRE calculator shows you how much you need to save based on the 4% withdrawal rule and your annual expenses.',
    category: 'features'
  },
  {
    question: 'Can I export my data?',
    answer: 'Yes! Go to Settings → Data Management → "Export My Data (CSV)". This downloads all your financial data in CSV format, which you can open in Excel or Google Sheets.',
    category: 'features'
  },

  // Privacy & Security
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. Your data is encrypted in transit (HTTPS) and at rest. We use Supabase for authentication and database, which follows industry-standard security practices. We never sell your data.',
    category: 'privacy'
  },
  {
    question: 'Who can see my financial data?',
    answer: 'Only you. Your data is private and protected by Row-Level Security (RLS). Even our database administrators cannot access your data without your account credentials.',
    category: 'privacy'
  },
  {
    question: 'Can I delete my account?',
    answer: 'Yes. Go to Settings → Danger Zone → "Delete Account". This permanently deletes your account and ALL data. This action cannot be undone and is GDPR/CCPA compliant.',
    category: 'privacy'
  },
  {
    question: 'What happens to my data if I delete my account?',
    answer: 'All your data is immediately and permanently deleted from our database. This includes your profile, settings, expenses, goals, scenarios - everything. We comply with GDPR Article 17 (Right to Erasure).',
    category: 'privacy'
  },
  {
    question: 'Do you share data with third parties?',
    answer: 'No. We do not sell, rent, or share your personal financial data with third parties. We use Supabase (hosting) and Vercel (deployment), both of which have strict privacy policies.',
    category: 'privacy'
  },

  // Technical
  {
    question: 'Does it work on mobile?',
    answer: 'Yes! Personal Runway is fully responsive and optimized for mobile devices (iPhone, Android, tablets). You can use it on any screen size.',
    category: 'technical'
  },
  {
    question: 'Do I need to install anything?',
    answer: 'No. Personal Runway is a web app - just visit the URL in your browser. You can also add it to your home screen for a native app-like experience.',
    category: 'technical'
  },
  {
    question: 'Does it work offline?',
    answer: 'Not yet. Currently, you need an internet connection to use the app. Offline support (PWA) is planned for a future update.',
    category: 'technical'
  },
  {
    question: 'I forgot my password. How do I reset it?',
    answer: 'On the sign-in page, click "Forgot password?" Enter your email, and we\'ll send you a password reset link. Check your inbox (and spam folder!).',
    category: 'technical'
  },
  {
    question: 'Can I change my email address?',
    answer: 'Not yet. Email changing is coming soon. For now, if you need to change your email, please delete your account and create a new one with the correct email.',
    category: 'technical'
  },
  {
    question: 'Which currencies are supported?',
    answer: 'We support 8 currencies: USD ($), KRW (₩), EUR (€), GBP (£), JPY (¥), CNY (¥), AUD (A$), CAD (C$). Note: We do NOT do currency conversion - your amounts are stored as-is.',
    category: 'technical'
  },

  // Beta Program
  {
    question: 'What is the beta program?',
    answer: 'The beta program gives early users a chance to test Personal Runway before the public launch. We collect feedback, fix bugs, and improve features based on your input.',
    category: 'beta'
  },
  {
    question: 'How long will the beta last?',
    answer: 'The private beta will run for 2 weeks, followed by a public beta. We expect to launch the stable version within 1-2 months.',
    category: 'beta'
  },
  {
    question: 'What are the benefits of being a beta tester?',
    answer: 'Beta testers get early access, direct influence on features, and a 50% lifetime discount on any future premium features we introduce.',
    category: 'beta'
  },
  {
    question: 'How do I report a bug?',
    answer: 'Send bug reports via the beta feedback form (link in your welcome email) or email us directly. Include screenshots and steps to reproduce if possible.',
    category: 'beta'
  },
  {
    question: 'Will my beta data be deleted after launch?',
    answer: 'No! Your data will persist into the stable release. The beta account you create now is your permanent account.',
    category: 'beta'
  },
];

const categories = [
  { id: 'getting-started', name: 'Getting Started', icon: Zap },
  { id: 'features', name: 'Features', icon: HelpCircle },
  { id: 'privacy', name: 'Privacy & Security', icon: Shield },
  { id: 'technical', name: 'Technical', icon: Database },
  { id: 'beta', name: 'Beta Program', icon: Calendar },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="bg-surface-card border-b border-border-subtle">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                Frequently Asked Questions
              </h1>
              <p className="text-text-secondary">
                Everything you need to know about Personal Runway
              </p>
            </div>
            <Link 
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg
                transition-all duration-200 font-medium"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <div className="sticky top-0 z-10 bg-bg-primary/95 backdrop-blur-sm border-b border-border-subtle">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                activeCategory === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-surface-hover text-text-secondary hover:bg-surface-active'
              }`}
            >
              All ({faqs.length})
            </button>
            {categories.map((cat) => {
              const Icon = cat.icon;
              const count = faqs.filter(faq => faq.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                    activeCategory === cat.id
                      ? 'bg-primary text-white'
                      : 'bg-surface-hover text-text-secondary hover:bg-surface-active'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* FAQ List */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-surface-card border border-border-subtle rounded-lg overflow-hidden
                  hover:border-border-strong transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left
                    hover:bg-surface-hover transition-colors duration-200"
                >
                  <span className="text-text-primary font-semibold pr-4">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-text-tertiary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-text-tertiary flex-shrink-0" />
                  )}
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-4 pt-2">
                    <p className="text-text-secondary leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-tertiary">
              No FAQs found in this category.
            </p>
          </div>
        )}

        {/* Still have questions? */}
        <div className="mt-12 p-6 bg-primary/10 border border-primary/20 rounded-xl text-center">
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Still have questions?
          </h3>
          <p className="text-text-secondary mb-4">
            We're here to help! Send us your questions via the beta feedback form.
          </p>
          <a
            href="mailto:support@example.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg
              font-semibold transition-all duration-200"
          >
            Contact Support
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-text-tertiary">
          <p>
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            {' · '}
            <Link href="/" className="text-primary hover:underline">
              Back to App
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
