import Decimal from "decimal.js"
import React, { JSX, useMemo } from "react"
import { Period } from "./AmortizationLayout"
import { NumericFormat } from "react-number-format"
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"
import colors from 'tailwindcss/colors'

interface AmortizationStatsProps {
	periods: Period[]
}

const AmortizationStats: React.FC<AmortizationStatsProps> = React.memo(({ periods }) => {
	const [activeIndex, setActiveIndex] = React.useState(0);

	// The below calcs are done more than once. We should probably 
	const totalPrincipalPaid: Decimal = useMemo(
		() => periods.reduce<Decimal>((acc, current) => acc.plus(current.principalDue || 0), new Decimal(0)),
		[periods]
	)

	const totalInterestPaid: Decimal = useMemo(
		() => periods.reduce<Decimal>((acc, current) => acc.plus(current.interestDue || 0), new Decimal(0)),
		[periods]
	)

	const totalAmountPaid: Decimal = totalPrincipalPaid.plus(totalInterestPaid)

	const initialLoanAmount: Decimal = useMemo(
		() => new Decimal(periods.length > 0 ? periods[0].remainingBalance.plus(totalAmountPaid) : 0),
		[periods, totalAmountPaid]
	)

	const remainingBalance: Decimal = useMemo(() => initialLoanAmount.minus(totalAmountPaid), [initialLoanAmount, totalAmountPaid])

	if (periods.length < 1) {
		return null
	}

	// Data for Donut Chart
	const data = [
		{ name: "Principal Paid", value: totalPrincipalPaid.toNumber(), color: colors.indigo[900] },
		{ name: "Interest Paid", value: totalInterestPaid.toNumber(), color: colors.indigo[600] },
		{ name: "Remaining Balance", value: remainingBalance.toNumber(), color: colors.indigo[300] },
	]

	// Format currency for display
	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(value);
	};

	// Enhanced active sector rendering for professional look
	const renderActiveShape = (props: PieSectorDataItem): JSX.Element => {
		const {
			cx = 0,
			cy = 0,
			innerRadius,
			outerRadius = 0,
			startAngle,
			endAngle,
			fill,
			payload,
			percent,
			value
		} = props as PieSectorDataItem & {
			payload: { name: string; value: number };
			percent: number;
			value: number;
		};

		return (
			<g>
				<text x={cx} y={cy - 15} dy={8} textAnchor="middle" fill={colors.gray[700]} className="text-lg font-semibold">
					{payload.name}
				</text>
				<text x={cx} y={cy + 15} dy={8} textAnchor="middle" fill={colors.gray[700]} fontWeight={500}>
					{formatCurrency(value)}
				</text>
				<text x={cx} y={cy + 40} dy={8} textAnchor="middle" fill={colors.gray[900]}>
					{`${(percent * 100).toFixed(1)}%`}
				</text>
				<Sector
					cx={cx}
					cy={cy}
					innerRadius={innerRadius}
					outerRadius={outerRadius + 10}
					startAngle={startAngle}
					endAngle={endAngle}
					fill={fill}
				/>
				<Sector
					cx={cx}
					cy={cy}
					startAngle={startAngle}
					endAngle={endAngle}
					innerRadius={outerRadius + 15}
					outerRadius={outerRadius + 20}
					fill={fill}
				/>
			</g>
		);
	};

	const onPieEnter = (_: React.MouseEvent, index: number) => {
		setActiveIndex(index);
	};

	return (
		<div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full min-w-0 mb-6">
				{/* Interest Paid */}
				<div className="flex flex-col items-center px-6 py-2 bg-white shadow rounded-lg">
					<NumericFormat
						className="text-2xl font-bold text-indigo-600"
						value={totalInterestPaid.toDP(2).toNumber()}
						displayType="text"
						prefix="$"
						thousandSeparator
					/>
					<div className="text-sm font-medium">Interest Paid</div>
				</div>

				<div className="flex flex-col items-center px-6 py-2 bg-white shadow rounded-lg">
					<NumericFormat
						className="text-2xl font-bold text-indigo-600"
						value={totalPrincipalPaid.toDP(2).toNumber()}
						displayType="text"
						prefix="$"
						thousandSeparator
					/>
					<div className="text-sm font-medium">Principal Paid</div>
				</div>

				<div className="flex flex-col items-center px-6 py-2 bg-white shadow rounded-lg">
					<NumericFormat
						className="text-2xl font-bold text-indigo-600"
						value={totalAmountPaid.toDP(2).toNumber()}
						displayType="text"
						prefix="$"
						thousandSeparator
					/>
					<div className="text-sm font-medium">Total Paid</div>
				</div>
			</div>

			{/* Donut Chart Section */}
			<div className="flex flex-col items-center justify-center w-full bg-white shadow rounded-lg">
				<h3 className="text-lg font-semibold text-center mt-3">Loan Payment Breakdown</h3>
				<ResponsiveContainer width="100%" height={400}>
					<PieChart>
						<Pie
							data={data}
							cx="50%"
							cy="50%"
							innerRadius={80}
							outerRadius={120}
							fill={colors.indigo['900']}
							dataKey="value"
							activeIndex={activeIndex}
							activeShape={renderActiveShape}
							onMouseEnter={onPieEnter}
						>
							{data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} />
							))}
						</Pie>
						<Legend
							layout="horizontal"
							verticalAlign="bottom"
							align="center"
							wrapperStyle={{
								fontSize: "14px",
								fontWeight: "bold",
								marginTop: "10px",
								display: "flex",
								flexWrap: "wrap",
								justifyContent: "center"
							}}
						/>
					</PieChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
})

export default AmortizationStats
