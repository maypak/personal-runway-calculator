/**
 * Comparison Page - /scenarios/compare
 * 
 * Purpose: Side-by-side scenario comparison
 * Route: /scenarios/compare?ids=id1,id2
 * 
 * Created: 2026-02-17
 * Author: Senior Frontend Developer
 */

import { ComparisonView } from '../../components/ComparisonView';

export const metadata = {
  title: 'Compare Scenarios | Personal Runway Calculator',
  description: 'Side-by-side comparison of your financial scenarios',
};

export default function ComparePage() {
  return <ComparisonView />;
}
