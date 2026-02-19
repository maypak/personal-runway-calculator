import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - Personal Runway Calculator',
  description: 'Privacy policy for Personal Runway Calculator',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-bg-primary py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-primary hover:underline mb-8 inline-block">
          ← Back to Calculator
        </Link>

        <h1 className="text-3xl font-bold text-text-primary mb-2">Privacy Policy</h1>
        <p className="text-text-tertiary mb-8">Last updated: February 19, 2026</p>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-text-primary">1. Introduction</h2>
            <p className="text-text-secondary">
              Personal Runway Calculator (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) respects your privacy. 
              This policy explains how we collect, use, and protect your personal information when you use 
              our financial planning tool at personal-runway-calculator.vercel.app.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary">2. Information We Collect</h2>
            <h3 className="text-lg font-medium text-text-primary mt-4">Account Information</h3>
            <ul className="list-disc pl-6 text-text-secondary space-y-1">
              <li>Email address (for authentication)</li>
              <li>Authentication provider data (Google, GitHub — name and avatar only)</li>
            </ul>
            <h3 className="text-lg font-medium text-text-primary mt-4">Financial Data You Provide</h3>
            <ul className="list-disc pl-6 text-text-secondary space-y-1">
              <li>Savings amounts, monthly expenses, and income figures</li>
              <li>Scenario configurations and phase plans</li>
              <li>FIRE calculator settings</li>
            </ul>
            <h3 className="text-lg font-medium text-text-primary mt-4">Automatically Collected</h3>
            <ul className="list-disc pl-6 text-text-secondary space-y-1">
              <li>Basic analytics via Vercel Analytics (page views, no personal data)</li>
              <li>No cookies are used for tracking</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-text-secondary space-y-1">
              <li>To provide the financial runway calculation service</li>
              <li>To save and sync your data across devices</li>
              <li>To improve the product based on aggregate, anonymized usage patterns</li>
            </ul>
            <p className="text-text-secondary font-medium mt-2">
              We do NOT sell, rent, or share your personal or financial data with third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary">4. Data Storage & Security</h2>
            <ul className="list-disc pl-6 text-text-secondary space-y-1">
              <li>Data is stored in Supabase (PostgreSQL) with Row Level Security (RLS)</li>
              <li>All data is encrypted in transit (TLS/HTTPS) and at rest</li>
              <li>Each user can only access their own data — enforced at the database level</li>
              <li>We use industry-standard security practices including CSP headers, HSTS, and XSS protection</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary">5. Your Rights</h2>
            <p className="text-text-secondary">You have the right to:</p>
            <ul className="list-disc pl-6 text-text-secondary space-y-1">
              <li><strong>Access</strong> your personal data at any time through the app</li>
              <li><strong>Export</strong> your data (feature coming soon)</li>
              <li><strong>Delete</strong> your account and all associated data by contacting us</li>
              <li><strong>Correct</strong> any inaccurate information in your profile</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary">6. Third-Party Services</h2>
            <ul className="list-disc pl-6 text-text-secondary space-y-1">
              <li><strong>Supabase</strong> — Database and authentication (<a href="https://supabase.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>)</li>
              <li><strong>Vercel</strong> — Hosting and analytics (<a href="https://vercel.com/legal/privacy-policy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>)</li>
              <li><strong>Google/GitHub</strong> — OAuth authentication (only if you choose social login)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary">7. Data Retention</h2>
            <p className="text-text-secondary">
              We retain your data for as long as your account is active. If you delete your account, 
              all associated data will be permanently removed within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary">8. Children&apos;s Privacy</h2>
            <p className="text-text-secondary">
              This service is not intended for users under 16 years of age. We do not knowingly 
              collect data from children.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary">9. Changes to This Policy</h2>
            <p className="text-text-secondary">
              We may update this policy from time to time. Changes will be posted on this page 
              with an updated &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary">10. Contact</h2>
            <p className="text-text-secondary">
              For privacy-related questions or data deletion requests, please open an issue on our{' '}
              <a href="https://github.com/maypak/personal-runway-calculator" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                GitHub repository
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border-subtle text-center text-sm text-text-tertiary">
          © 2026 Personal Runway Calculator. All rights reserved.
        </div>
      </div>
    </div>
  );
}
