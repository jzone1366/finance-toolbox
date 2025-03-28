import React from "react"
import colors from 'tailwindcss/colors'
import { Period } from "./AmortizationLayout"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Calculate interval based on number of periods
const getInterval = (totalPeriods: number) => {
	if (totalPeriods <= 60) return 6 // For <= 5 years, show every 6 months
	if (totalPeriods <= 180) return 12 // For <= 15 years, show yearly
	return 24 // For > 15 years, show every 2 years
}

interface AmortizationGraphProps {
	periods: Period[]
	label: string
}
const AmortizationGraph: React.FC<AmortizationGraphProps> = React.memo(({ periods, label }) => {
	if (periods.length < 1) {
		return null
	}

	const interval = getInterval(periods.length)

	// Filter data points to show only at intervals
	const graphData = periods
		.filter((period) => period.period === 0 || period.period % interval === 0 || period.period === periods.length - 1)
		.map((period) => {
			return {
				period: period.period === 0 ? 'Start' : period.period,
				interestDue: period.interestDue ? period.interestDue.toDP(2).toNumber() : 0,
				principalDue: period.principalDue ? period.principalDue.toDP(2).toNumber() : 0,
				balance: period.remainingBalance ? period.remainingBalance.toDP(2).toNumber() : 0,
			}
		})

	const formatYAxis = (value: number) => {
		if (value >= 1000000) {
			return `$${(value / 1000000).toFixed(1)}M`
		} else if (value >= 1000) {
			return `$${(value / 1000).toFixed(0)}K`
		}
		return `$${value}`
	}

	const formatTooltipValue = (value: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(value)
	}

	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-white p-3 border border-gray-200 rounded shadow-sm">
					<p className="font-medium text-sm">{`Period: ${label}`}</p>
					{payload.map((entry: any, index: number) => (
						<p key={index} className="text-sm" style={{ color: entry.color }}>
							{`${entry.name}: ${formatTooltipValue(entry.value)}`}
						</p>
					))}
				</div>
			)
		}
		return null
	}

	return (
		<div className="w-full bg-white mt-4 p-2 rounded-lg shadow">
			<ResponsiveContainer height={300} width="100%">
				<LineChart
					data={graphData}
					margin={{
						top: 5,
						right: 30,
						left: 20,
						bottom: 5,
					}}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis
						dataKey="period"
						tick={{ fontSize: 12 }}
					/>
					<YAxis
						tickFormatter={formatYAxis}
						tick={{ fontSize: 12 }}
					/>
					<Tooltip content={<CustomTooltip />} />
					<Legend />
					<Line
						type="monotone"
						dataKey="principalDue"
						stroke={colors.indigo[900]}
						name={`${label} - Principal`}
						strokeWidth={2}
						dot={{ r: 3 }}
						activeDot={{ r: 5 }}
					/>
					<Line
						type="monotone"
						dataKey="interestDue"
						stroke={colors.indigo[600]}
						name={`${label} - Interest`}
						strokeWidth={2}
						dot={{ r: 3 }}
						activeDot={{ r: 5 }}
					/>
					<Line
						type="monotone"
						dataKey="balance"
						stroke={colors.indigo[300]}
						name={`${label} - Balance`}
						strokeWidth={2}
						dot={{ r: 3 }}
						activeDot={{ r: 5 }}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	)
})

export default AmortizationGraph
