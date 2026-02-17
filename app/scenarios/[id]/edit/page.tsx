/**
 * Scenario Edit Page - /scenarios/[id]/edit
 * 
 * Purpose: Edit existing scenario financial data
 * Features:
 * - Edit scenario name and description
 * - Update financial inputs (savings, expenses, income)
 * - Auto-save with recalculation
 * - Back navigation
 * 
 * Created: 2026-02-17
 * Author: Senior Frontend Developer (subagent)
 */

import { ScenarioEditForm } from '../../../components/ScenarioEditForm';

export const metadata = {
  title: 'Edit Scenario | Personal Runway Calculator',
  description: 'Edit your financial scenario',
};

export default function ScenarioEditPage({ params }: { params: { id: string } }) {
  return <ScenarioEditForm scenarioId={params.id} />;
}
