import Decimal from "decimal.js"
import React, { useMemo } from "react"
import { Period } from "./AmortizationLayout"
import { NumericFormat } from "react-number-format"

interface AmortizationStatsProps {
	periods: Period[]
}

const AmortizationStats: React.FC<AmortizationStatsProps> = React.memo(({ periods }) => {
	const totalPrincipalPaid: Decimal = new Decimal(periods.length > 0 ? periods[0].remainingBalance : 0)

	const totalInterestPaid: Decimal = useMemo(
		() => periods.reduce<Decimal>((acc, current) => acc.plus(current.interestDue || 0), new Decimal(0)),
		[periods]
	)

	const totalAmountPaid: Decimal = useMemo(
		() => periods.reduce<Decimal>((acc, current) => acc.plus(current.paymentDue || 0), new Decimal(0)),
		[periods]
	)

	if (periods.length < 1) {
		return null
	}

	return (
		<div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full min-w-0 mb-6">
				<div className="flex flex-col px-6 py-2 bg-white shadow rounded-lg">
					<div className="flex flex-col items-center space-y-2">
						<NumericFormat className="text-2xl font-bold tracking-tight leading-none text-indigo-600" value={totalInterestPaid.toDP(2).toNumber()} displayType="text" prefix="$" thousandSeparator />
						<div className="text-xs font-medium">Interest Paid</div>
					</div>
				</div>

				<div className="flex flex-col px-6 py-2 bg-white shadow rounded-lg">
					<div className="flex flex-col items-center space-y-2">
						<NumericFormat className="text-2xl font-bold tracking-tight leading-none text-indigo-600" value={totalPrincipalPaid.toDP(2).toNumber()} displayType="text" prefix="$" thousandSeparator />
						<div className="text-xs font-medium">Principal Paid</div>
					</div>
				</div>

				<div className="flex flex-col px-6 py-2 bg-white shadow rounded-lg">
					<div className="flex flex-col items-center space-y-2">
						<NumericFormat className="text-2xl font-bold tracking-tight leading-none text-indigo-600" value={totalAmountPaid.toDP(2).toNumber()} displayType="text" prefix="$" thousandSeparator />
						<div className="text-xs font-medium">Total Paid</div>
					</div>
				</div>
			</div>
		</div>
	)
})

export default AmortizationStats
