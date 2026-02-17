/**
 * Phase Templates
 * 
 * Pre-built phase templates for common scenarios:
 * - Sabbatical
 * - Career Transition
 * - Founder Journey
 */

import { PhaseTemplate } from '@/app/types'

export const PHASE_TEMPLATES: PhaseTemplate[] = [
  {
    name: 'Sabbatical',
    description: 'Take a break: Travel → Rest → Job Hunt',
    phases: [
      {
        name: 'Travel & Explore',
        description: 'Explore the world, clear your mind',
        phaseOrder: 0,
        startMonth: 0,
        endMonth: 6,
        monthlyExpenses: 3000,
        monthlyIncome: 0,
        oneTimeExpenses: [
          { name: 'Flight Tickets', amount: 2500, month: 0 },
          { name: 'Travel Insurance', amount: 500, month: 0 },
        ],
      },
      {
        name: 'Rest & Recharge',
        description: 'Relax at home, spend time with family',
        phaseOrder: 1,
        startMonth: 6,
        endMonth: 9,
        monthlyExpenses: 2000,
        monthlyIncome: 0,
        oneTimeExpenses: [],
      },
      {
        name: 'Job Hunt',
        description: 'Find your next opportunity',
        phaseOrder: 2,
        startMonth: 9,
        endMonth: 15,
        monthlyExpenses: 3500,
        monthlyIncome: 500, // Freelance/consulting
        oneTimeExpenses: [
          { name: 'Resume Service', amount: 300, month: 0 },
          { name: 'Interview Wardrobe', amount: 500, month: 1 },
        ],
      },
    ],
  },
  {
    name: 'Career Transition',
    description: 'Switch careers: Learn → Build → Launch',
    phases: [
      {
        name: 'Learning Phase',
        description: 'Bootcamp, courses, upskilling',
        phaseOrder: 0,
        startMonth: 0,
        endMonth: 3,
        monthlyExpenses: 2500,
        monthlyIncome: 0,
        oneTimeExpenses: [
          { name: 'Bootcamp Tuition', amount: 6000, month: 0 },
          { name: 'Books & Resources', amount: 300, month: 0 },
        ],
      },
      {
        name: 'Portfolio Building',
        description: 'Build projects, create portfolio',
        phaseOrder: 1,
        startMonth: 3,
        endMonth: 6,
        monthlyExpenses: 2500,
        monthlyIncome: 500, // Small freelance gigs
        oneTimeExpenses: [
          { name: 'Domain & Hosting', amount: 200, month: 0 },
        ],
      },
      {
        name: 'Job Search',
        description: 'Apply, interview, land new role',
        phaseOrder: 2,
        startMonth: 6,
        endMonth: 12,
        monthlyExpenses: 3000,
        monthlyIncome: 1000, // More freelance
        oneTimeExpenses: [
          { name: 'Career Coaching', amount: 500, month: 0 },
        ],
      },
    ],
  },
  {
    name: 'Founder Journey',
    description: 'Build a startup: Ideation → MVP → Launch → Growth',
    phases: [
      {
        name: 'Ideation & Research',
        description: 'Validate idea, research market',
        phaseOrder: 0,
        startMonth: 0,
        endMonth: 2,
        monthlyExpenses: 2000,
        monthlyIncome: 0,
        oneTimeExpenses: [
          { name: 'Market Research Tools', amount: 500, month: 0 },
          { name: 'Legal (LLC)', amount: 800, month: 1 },
        ],
      },
      {
        name: 'MVP Development',
        description: 'Build minimum viable product',
        phaseOrder: 1,
        startMonth: 2,
        endMonth: 5,
        monthlyExpenses: 3000,
        monthlyIncome: 0,
        oneTimeExpenses: [
          { name: 'Developer Tools', amount: 600, month: 0 },
          { name: 'Design Assets', amount: 400, month: 0 },
        ],
      },
      {
        name: 'Launch & Marketing',
        description: 'Launch product, get first customers',
        phaseOrder: 2,
        startMonth: 5,
        endMonth: 9,
        monthlyExpenses: 4000,
        monthlyIncome: 500, // First revenue
        oneTimeExpenses: [
          { name: 'Marketing Campaign', amount: 2000, month: 0 },
          { name: 'Product Hunt Launch', amount: 500, month: 1 },
        ],
      },
      {
        name: 'Growth',
        description: 'Scale product, acquire users',
        phaseOrder: 3,
        startMonth: 9,
        endMonth: 18,
        monthlyExpenses: 5000,
        monthlyIncome: 2000, // Growing revenue
        oneTimeExpenses: [
          { name: 'Paid Ads Budget', amount: 3000, month: 0 },
          { name: 'Conference Booth', amount: 1500, month: 3 },
        ],
      },
    ],
  },
  {
    name: 'Digital Nomad',
    description: 'Work while traveling: Asia → Europe → Americas',
    phases: [
      {
        name: 'Southeast Asia',
        description: 'Thailand, Vietnam, Indonesia (Low cost)',
        phaseOrder: 0,
        startMonth: 0,
        endMonth: 6,
        monthlyExpenses: 2000,
        monthlyIncome: 3000, // Remote work
        oneTimeExpenses: [
          { name: 'Flights to Asia', amount: 1200, month: 0 },
          { name: 'Visas', amount: 400, month: 0 },
        ],
      },
      {
        name: 'Europe',
        description: 'Portugal, Spain, Greece (Medium cost)',
        phaseOrder: 1,
        startMonth: 6,
        endMonth: 12,
        monthlyExpenses: 3500,
        monthlyIncome: 3500, // Break-even
        oneTimeExpenses: [
          { name: 'Flights to Europe', amount: 800, month: 0 },
          { name: 'Schengen Visa', amount: 200, month: 0 },
        ],
      },
      {
        name: 'Americas',
        description: 'Mexico, Colombia, Argentina (Varied cost)',
        phaseOrder: 2,
        startMonth: 12,
        endMonth: 18,
        monthlyExpenses: 2500,
        monthlyIncome: 3500, // Saving again
        oneTimeExpenses: [
          { name: 'Flights to Americas', amount: 600, month: 0 },
        ],
      },
    ],
  },
  {
    name: 'Parental Leave Extended',
    description: 'Extended time with newborn: Care → Transition → Return',
    phases: [
      {
        name: 'Full-time Care',
        description: 'First 6 months with baby',
        phaseOrder: 0,
        startMonth: 0,
        endMonth: 6,
        monthlyExpenses: 3500,
        monthlyIncome: 0,
        oneTimeExpenses: [
          { name: 'Baby Essentials', amount: 2000, month: 0 },
          { name: 'Nursery Setup', amount: 1500, month: 0 },
        ],
      },
      {
        name: 'Gradual Transition',
        description: 'Part-time childcare, explore options',
        phaseOrder: 1,
        startMonth: 6,
        endMonth: 9,
        monthlyExpenses: 4000, // Childcare costs
        monthlyIncome: 1500, // Part-time consulting
        oneTimeExpenses: [],
      },
      {
        name: 'Return to Work',
        description: 'Full-time with childcare',
        phaseOrder: 2,
        startMonth: 9,
        endMonth: 12,
        monthlyExpenses: 5000, // Full childcare
        monthlyIncome: 4000, // More work
        oneTimeExpenses: [
          { name: 'Work Wardrobe', amount: 600, month: 0 },
        ],
      },
    ],
  },
]

/**
 * Get template by name
 */
export function getPhaseTemplate(name: string): PhaseTemplate | undefined {
  return PHASE_TEMPLATES.find(t => t.name === name)
}

/**
 * Get all template names
 */
export function getTemplateNames(): string[] {
  return PHASE_TEMPLATES.map(t => t.name)
}
