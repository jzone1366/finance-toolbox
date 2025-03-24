import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Label } from "recharts"
import colors from 'tailwindcss/colors'
import { Period } from "./AmortizationLayout"
import React, { useMemo } from "react"
import { Decimal } from "decimal.js"
import { NumericFormat } from "react-number-format"

interface AmortizationPieChartProps {
	periods: Period[]
}

// Custom label function
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, index }: any) => {
	const RADIAN = Math.PI / 180
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5
	const x = cx + radius * Math.cos(-midAngle * RADIAN)
	const y = cy + radius * Math.sin(-midAngle * RADIAN)

	// Extracting formatted value as string from NumericFormat
	const formattedValue = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(value);

	return (
		<text x={x} y={y} fill="black" textAnchor="middle" dominantBaseline="central" fontSize={12}>
			{formattedValue}
		</text>
	)
}

const AmortizationPieChart: React.FC<AmortizationPieChartProps> = React.memo(({ periods }) => {
	// @Fix: Need to fix this to use the totals values
	//
	const totalPrincipalPaid: Decimal = new Decimal(periods.length > 0 ? periods[0].remainingBalance : 0)

	const totalInterestPaid: Decimal = useMemo(
		() => periods.reduce<Decimal>((acc, current) => acc.plus(current.interestDue || 0), new Decimal(0)),
		[periods]
	)

	const totalAmountPaid: Decimal = useMemo(
		() => periods.reduce<Decimal>((acc, current) => acc.plus(current.paymentDue || 0), new Decimal(0)),
		[periods]
	)

	const graphData = [
		{ name: "Interest Due", value: totalInterestPaid.toDP(2).toNumber(), color: colors.purple[600] },
		{ name: "Principal Due", value: totalPrincipalPaid.toDP(2).toNumber(), color: colors.green[600] },
		{ name: "RemainingBalance", value: totalAmountPaid.toDP(2).toNumber(), color: colors.sky[600] },
	]


	return (
		<div className="min-w-full bg-white rounded-lg shadow">
			<ResponsiveContainer width="100%" height={300}>
				<PieChart>
					<Pie
						cx="50%"
						cy="50%"
						outerRadius={80}
						dataKey="value"
						data={graphData}
						labelLine={false}
						label={renderCustomLabel}
					>
						{
							graphData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} />
							))
						}
					</Pie>
					<Tooltip formatter={(value) => (
						<NumericFormat
							value={Number(value)}
							displayType="text"
							thousandSeparator=","
							decimalScale={2}
							fixedDecimalScale
							prefix="$"
						/>
					)} />
				</PieChart>
			</ResponsiveContainer>
		</div >
	)
})

export default AmortizationPieChart
