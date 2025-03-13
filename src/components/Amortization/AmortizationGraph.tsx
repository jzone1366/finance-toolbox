import React from "react"
import { Period } from "./AmortizationLayout"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface AmortizationGraphProps {
	periods: Period[]

}
const AmortizationGraph: React.FC<AmortizationGraphProps> = React.memo(({ periods }) => {
	if (periods.length < 1) {
		return null
	}

	const graphData = periods.map((period) => {
		return {
			period: period.period,
			interestDue: period.interestDue ? period.interestDue.toDP(2).toNumber() : 0,
			principalDue: period.principalDue ? period.principalDue.toDP(2).toNumber() : 0,
			total: period.remainingBalance ? period.remainingBalance.toDP(2).toNumber() : 0,
		}
	})

	return (
		<div className="w-full">
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
					<XAxis dataKey="period" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Line type="monotone" dataKey="interestDue" stroke="#8884d8" />
					<Line type="monotone" dataKey="principalDue" stroke="#82ca9d" />
					<Line type="monotone" dataKey="total" stroke="blue" />
				</LineChart>
			</ResponsiveContainer>
		</div>
	)
})

export default AmortizationGraph
