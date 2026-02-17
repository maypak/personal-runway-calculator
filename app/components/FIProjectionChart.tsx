/**
 * FI Projection Chart Component
 * 
 * Purpose: Visualize compound growth towards FI Number
 * Features:
 * - Three lines: Current trajectory, Coast FIRE, FI Number target
 * - Recharts LineChart (responsive)
 * - Time (years) on X-axis, Net worth ($) on Y-axis
 * - Mobile responsive with simplified view
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
  ReferenceLine,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';

interface FIProjectionChartProps {
  currentSavings: number;
  monthlyContribution: number;
  fiNumber: number;
  investmentReturnRate?: number;
  maxYears?: number;
  className?: string;
}

interface ChartDataPoint {
  year: number;
  currentTrajectory: number;
  coastFire: number;
  fiTarget: number;
}

export default function FIProjectionChart({
  currentSavings,
  monthlyContribution,
  fiNumber,
  investmentReturnRate = 7.0,
  maxYears = 30,
  className = '',
}: FIProjectionChartProps) {
  const { t } = useI18n();
  
  // Generate projection data
  const chartData = useMemo(() => {
    // Sanitize inputs
    const safeCurrentSavings = isFinite(currentSavings) && !isNaN(currentSavings) ? Math.max(0, currentSavings) : 0;
    const safeMonthlyContribution = isFinite(monthlyContribution) && !isNaN(monthlyContribution) ? monthlyContribution : 0;
    const safeFINumber = isFinite(fiNumber) && !isNaN(fiNumber) && fiNumber > 0 ? fiNumber : 1;
    const safeReturnRate = isFinite(investmentReturnRate) && !isNaN(investmentReturnRate) 
      ? Math.max(0, Math.min(50, investmentReturnRate)) 
      : 7.0;
    
    const data: ChartDataPoint[] = [];
    const monthlyRate = safeReturnRate / 100 / 12;
    
    let balanceWithSavings = safeCurrentSavings;
    let balanceCoast = safeCurrentSavings;
    
    // Add initial point (Year 0)
    data.push({
      year: 0,
      currentTrajectory: safeCurrentSavings,
      coastFire: safeCurrentSavings,
      fiTarget: safeFINumber,
    });
    
    // Generate yearly data points
    for (let year = 1; year <= maxYears; year++) {
      // Calculate for 12 months
      for (let month = 0; month < 12; month++) {
        // Current trajectory: with monthly contributions
        balanceWithSavings = balanceWithSavings * (1 + monthlyRate) + safeMonthlyContribution;
        
        // Coast FIRE: no contributions, just compound growth
        balanceCoast = balanceCoast * (1 + monthlyRate);
        
        // Safety check: prevent infinite values
        if (!isFinite(balanceWithSavings) || !isFinite(balanceCoast)) {
          return data;
        }
      }
      
      data.push({
        year,
        currentTrajectory: balanceWithSavings,
        coastFire: balanceCoast,
        fiTarget: safeFINumber,
      });
      
      // Stop if current trajectory far exceeds FI (150%)
      if (balanceWithSavings > safeFINumber * 1.5) {
        break;
      }
    }
    
    return data;
  }, [currentSavings, monthlyContribution, fiNumber, investmentReturnRate, maxYears]);

  // Format currency for tooltips
  const formatCurrency = (value: number): string => {
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          {t('fire:projection.tooltip.year', { year: label })}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600 dark:text-gray-400">{entry.name}:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Determine if Coast FIRE already achieved
  const isCoastFireAchieved = chartData[chartData.length - 1]?.coastFire >= fiNumber;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('fire:projection.title')}
        </h3>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#374151"
            opacity={0.1}
          />
          <XAxis
            dataKey="year"
            label={{ value: t('fire:projection.xAxisLabel'), position: 'insideBottom', offset: -5 }}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            stroke="#9CA3AF"
          />
          <YAxis
            tickFormatter={formatCurrency}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            stroke="#9CA3AF"
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            iconType="line"
          />

          {/* FI Number target line (horizontal reference) */}
          <ReferenceLine
            y={fiNumber}
            stroke="#10B981"
            strokeDasharray="5 5"
            strokeWidth={2}
            label={{
              value: t('fire:projection.lines.fiTarget'),
              position: 'insideTopRight',
              fill: '#10B981',
              fontSize: 12,
            }}
          />

          {/* Current trajectory (with savings) */}
          <Line
            type="monotone"
            dataKey="currentTrajectory"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={false}
            name={t('fire:projection.lines.currentPath')}
            animationDuration={1000}
          />

          {/* Coast FIRE line (no savings, just growth) */}
          <Line
            type="monotone"
            dataKey="coastFire"
            stroke="#A855F7"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name={t('fire:projection.lines.coastFire')}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Info footer */}
      <div className="mt-4 space-y-2">
        <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
          <div className="w-3 h-0.5 bg-blue-600 mt-1.5" />
          <p dangerouslySetInnerHTML={{ 
            __html: t('fire:projection.legend.currentPath', { 
              monthlySavings: monthlyContribution.toLocaleString(),
              returnRate: investmentReturnRate
            })
          }} />
        </div>
        <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
          <div className="w-3 h-0.5 bg-purple-600 mt-1.5" style={{ backgroundImage: 'repeating-linear-gradient(to right, #A855F7 0, #A855F7 5px, transparent 5px, transparent 10px)' }} />
          <p dangerouslySetInnerHTML={{ 
            __html: t('fire:projection.legend.coastFire', { 
              currentSavings: currentSavings.toLocaleString(),
              achievedText: isCoastFireAchieved 
                ? t('fire:projection.legend.coastAchieved')
                : t('fire:projection.legend.coastNotAchieved')
            })
          }} />
        </div>
        <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
          <div className="w-3 h-0.5 bg-green-600 mt-1.5" style={{ backgroundImage: 'repeating-linear-gradient(to right, #10B981 0, #10B981 5px, transparent 5px, transparent 10px)' }} />
          <p dangerouslySetInnerHTML={{ 
            __html: t('fire:projection.legend.fiTarget', { 
              fiNumber: fiNumber.toLocaleString()
            })
          }} />
        </div>
      </div>
    </div>
  );
}
