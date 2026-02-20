/**
 * Comparison Page - /scenarios/compare
 * 
 * NOTE: Comparison is now modal-based in ScenarioManager.
 * This route redirects to /scenarios.
 * 
 * Created: 2026-02-17
 * Updated: 2026-02-21 - Moved to modal
 */

import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Compare Scenarios | Personal Runway Calculator',
  description: 'Side-by-side comparison of your financial scenarios',
};

export default function ComparePage() {
  redirect('/scenarios');
}
