import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { BUDGET_LABELS } from '../services/budgetCalculator'
import type { BudgetBreakdown } from '../types'
import { formatInr } from '../utils/currency'

const COLORS = ['#0f6b6c', '#c4a35a', '#c45c4a', '#3d4d63', '#7a8f6b', '#8c6b4f']

interface BudgetChartProps {
  breakdown: BudgetBreakdown
}

export function BudgetChart({ breakdown }: BudgetChartProps) {
  const data = (Object.keys(breakdown) as Array<keyof BudgetBreakdown>).map((key) => ({
    name: BUDGET_LABELS[key],
    value: breakdown[key],
  }))

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={2}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatInr(Number(value ?? 0))} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
