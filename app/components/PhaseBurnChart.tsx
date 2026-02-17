/**
 * PhaseBurnChart Component
 * 
 * Stacked area chart showing phase-by-phase spending over time.
 * Features:
 * - Color-coded phases (each phase gets unique color)
 * - Month markers on X-axis
 * - Interactive tooltips with phase details
 * - Responsive design
 */

'use client'

import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { PhaseRunwayResult, PhaseBreakdown } from '@/app/types'

export interface PhaseBurnChartProps {
  result: PhaseRunwayResult
  className?: string
}

// Color palette for phases (max 10 phases)
const PHASE_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#6366f1', // indigo
  '#f43f5e', // rose
  '#a855f7', // violet
]

interface ChartDataPoint {
  month: number
  [key: string]: number // Dynamic phase names as keys
}

export default function PhaseBurnChart({ result, className = '' }: PhaseBurnChartProps) {
  // Transform monthlyData + phaseBreakdown into chart-friendly format
  const chartData = useMemo(() => {
    const data: ChartDataPoint[] = []
    
    // For each month, determine which phase it belongs to and add cumulative burn
    result.monthlyData.forEach((monthData) => {
      const dataPoint: ChartDataPoint = { month: monthData.month }
      
      // Find which phase this month belongs to
      const currentPhase = result.phaseBreakdown.find(
        (phase) => monthData.month >= phase.startMonth && monthData.month < phase.endMonth
      )
      
      if (currentPhase) {
        dataPoint[currentPhase.phaseName] = monthData.expenses
      } else {
        // Gap between phases or before first phase
        dataPoint['Other'] = monthData.expenses
      }
      
      data.push(dataPoint)
    })
    
    return data
  }, [result])

  // Extract unique phase names for areas
  const phaseNames = useMemo(() => {
    const names = new Set<string>()
    result.phaseBreakdown.forEach((phase) => names.add(phase.phaseName))
    return Array.from(names)
  }, [result])

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null

    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Month {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600 dark:text-gray-400">{entry.name}:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              ${entry.value.toLocaleString()}
            </span>
          </div>
        ))}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">Total: </span>
          <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
            ${payload.reduce((sum: number, entry: any) => sum + entry.value, 0).toLocaleString()}
          </span>
        </div>
      </div>
    )
  }

  // Format Y-axis (thousands with K)
  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`
    }
    return `$${value}`
  }

  if (!result || result.monthlyData.length === 0) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">No phase data available</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            {phaseNames.map((name, index) => (
              <linearGradient key={name} id={`color${name}`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={PHASE_COLORS[index % PHASE_COLORS.length]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={PHASE_COLORS[index % PHASE_COLORS.length]}
                  stopOpacity={0.2}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis
            dataKey="month"
            label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
            className="text-xs text-gray-600 dark:text-gray-400"
          />
          <YAxis
            tickFormatter={formatYAxis}
            label={{ value: 'Monthly Expenses', angle: -90, position: 'insideLeft' }}
            className="text-xs text-gray-600 dark:text-gray-400"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '12px' }}
            iconType="circle"
          />
          {phaseNames.map((name, index) => (
            <Area
              key={name}
              type="monotone"
              dataKey={name}
              stackId="1"
              stroke={PHASE_COLORS[index % PHASE_COLORS.length]}
              fill={`url(#color${name})`}
              fillOpacity={1}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
