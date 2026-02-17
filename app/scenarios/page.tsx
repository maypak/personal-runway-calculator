/**
 * Scenarios Page - /scenarios
 * 
 * Purpose: Main scenarios management page
 * Route: /scenarios
 * 
 * Created: 2026-02-17
 * Author: Senior Frontend Developer
 */

import { ScenarioManager } from '../components/ScenarioManager';

export const metadata = {
  title: 'Your Scenarios | Personal Runway Calculator',
  description: 'Manage and compare your financial scenarios',
};

export default function ScenariosPage() {
  return <ScenarioManager />;
}
