import Decimal from "decimal.js"
import React, { useMemo } from "react"
import { Period } from "./AmortizationLayout"
import { NumericFormat } from "react-number-format"

interface AmortizationStatsProps {
	periods: Period[]
}

const AmortizationStats: React.FC<AmortizationStatsProps> = React.memo(({ periods }) => {

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

	if (periods.length < 1) {
		return null
	}

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
		</div>
	)
})

export default AmortizationStats
