/**
 * RunwayChart - Visual Runway Comparison
 * 
 * Purpose: Line chart showing savings over time for multiple scenarios
 * Features:
 * - Multi-line chart (one line per scenario)
 * - Color-coded scenarios
 * - Responsive (mobile-friendly)
 * - Interactive tooltips
 * - Legend
 * 
 * Created: 2026-02-17
 * Author: Senior Frontend Developer
 */

'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useI18n } from '../contexts/I18nContext';
import type { Scenario } from '../types';
import { calculateRunway } from '../utils/runwayCalculator';

interface RunwayChartProps {
  scenarios: Scenario[];
  height?: number;
}

const COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
];

export function RunwayChart({ scenarios, height = 400 }: RunwayChartProps) {
  const { t } = useI18n();

  // Calculate results for all scenarios
  const results = useMemo(() => {
    return scenarios.map(scenario => ({
      scenario,
      result: calculateRunway(scenario),
    }));
  }, [scenarios]);

  // Merge monthly data from all scenarios
  const chartData = useMemo(() => {
    if (!results || results.length === 0) return [];

    const maxMonths = Math.max(...results.map(r => r.result.runway));
    const data: Array<{ month: number; [key: string]: number }> = [];

    for (let month = 0; month <= maxMonths; month++) {
      const point: { month: number; [key: string]: number } = { month };

      results.forEach(({ scenario, result }) => {
        const monthData = result.monthlyData.find(m => m.month === month);
        // Use scenario name as key (ensure unique)
        point[scenario.name] = monthData?.savings || 0;
      });

      data.push(point);
    }

    return data;
  }, [results]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload?.length) return null;

    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
        <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {t('scenarios:comparison.chart.tooltip.month', { count: label })}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-700 dark:text-gray-300">
              {entry.name}:
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              ${entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Format Y-axis (thousands)
  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  if (!scenarios || scenarios.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg"
        style={{ height }}
      >
        <p className="text-gray-500 dark:text-gray-400">
          {t('scenarios:comparison.chart.noScenarios')}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {t('scenarios:comparison.chart.title')}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('scenarios:comparison.chart.subtitle')}
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          
          <XAxis
            dataKey="month"
            label={{ value: t('scenarios:comparison.chart.axes.months'), position: 'insideBottom', offset: -5 }}
            stroke="#6B7280"
          />
          
          <YAxis
            tickFormatter={formatYAxis}
            label={{
              value: t('scenarios:comparison.chart.axes.savings'),
              angle: -90,
              position: 'insideLeft',
              style: { textAnchor: 'middle' },
            }}
            stroke="#6B7280"
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
            }}
          />
          
          {scenarios.map((scenario, idx) => (
            <Line
              key={scenario.id}
              type="monotone"
              dataKey={scenario.name}
              stroke={COLORS[idx % COLORS.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
              name={scenario.name}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      
      {/* Scenario details */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map(({ scenario, result }, idx) => (
          <div
            key={scenario.id}
            className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
          >
            <div
              className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5"
              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {scenario.name}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {t('scenarios:comparison.chart.details.months', { count: result.runway })} • ${result.burnRate.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo burn
              </p>
              {result.breakevenMonth !== null && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  {t('scenarios:comparison.chart.details.breakeven', { month: result.breakevenMonth })}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
