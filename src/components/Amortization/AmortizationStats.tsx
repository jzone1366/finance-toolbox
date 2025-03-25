import Decimal from "decimal.js"
import React, { useMemo } from "react"
import { Period, AmortizationScenario } from "./AmortizationLayout"
import { NumericFormat } from "react-number-format"

interface AmortizationStatsProps {
	periods: Period[]
	scenarios?: AmortizationScenario[]
}

const AmortizationStats: React.FC<AmortizationStatsProps> = React.memo(({ periods, scenarios }) => {
	const totalPrincipalPaid: Decimal = useMemo(
		() => periods.reduce<Decimal>((acc, current) => acc.plus(current.principalDue || 0), new Decimal(0)),
		[periods]
	)

	const totalInterestPaid: Decimal = useMemo(
		() => periods.reduce<Decimal>((acc, current) => acc.plus(current.interestDue || 0), new Decimal(0)),
		[periods]
	)

	const totalAmountPaid: Decimal = totalPrincipalPaid.plus(totalInterestPaid)

	// Calculate difference between scenarios only if we have both scenarios
	const comparison = useMemo(() => {
		if (!scenarios || scenarios.length !== 2) return null

		const standardScenario = scenarios[0]
		const extraPaymentScenario = scenarios[1]

		const standardInterest = standardScenario.periods.reduce<Decimal>(
			(acc, current) => acc.plus(current.interestDue || 0),
			new Decimal(0)
		)
		const extraPaymentInterest = extraPaymentScenario.periods.reduce<Decimal>(
			(acc, current) => acc.plus(current.interestDue || 0),
			new Decimal(0)
		)

		const standardTotal = standardScenario.periods.reduce<Decimal>(
			(acc, current) => acc.plus(current.paymentDue || 0),
			new Decimal(0)
		)
		const extraPaymentTotal = extraPaymentScenario.periods.reduce<Decimal>(
			(acc, current) => acc.plus(current.paymentDue || 0),
			new Decimal(0)
		)

		const difference = {
			interestDifference: standardInterest.minus(extraPaymentInterest),
			totalDifference: standardTotal.minus(extraPaymentTotal)
		}

		// If this is the standard payment scenario, show additional costs
		if (periods === standardScenario.periods) {
			return {
				title1: "Additional Interest Cost",
				title2: "Additional Total Cost",
				value1: difference.interestDifference,
				value2: difference.totalDifference,
				colorClass: "text-red-600",
				bgColorClass: "bg-red-50"
			}
		}
		// If this is the extra payment scenario, show savings
		else {
			return {
				title1: "Interest Saved",
				title2: "Total Amount Saved",
				value1: difference.interestDifference,
				value2: difference.totalDifference,
				colorClass: "text-green-600",
				bgColorClass: "bg-green-50"
			}
		}
	}, [scenarios, periods])

	if (periods.length < 1) {
		return null
	}

	return (
		<div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full min-w-0 mb-4">
				{/* Interest Paid */}
				<div className="flex flex-col items-center px-3 py-2 bg-white shadow rounded-lg">
					<NumericFormat
						className="text-xl font-bold text-indigo-600 truncate"
						value={totalInterestPaid.toDP(2).toNumber()}
						displayType="text"
						prefix="$"
						thousandSeparator
					/>
					<div className="text-sm font-medium">Interest Paid</div>
				</div>

				<div className="flex flex-col items-center px-3 py-2 bg-white shadow rounded-lg">
					<NumericFormat
						className="text-xl font-bold text-indigo-600 truncate"
						value={totalPrincipalPaid.toDP(2).toNumber()}
						displayType="text"
						prefix="$"
						thousandSeparator
					/>
					<div className="text-sm font-medium">Principal Paid</div>
				</div>

				<div className="flex flex-col items-center px-3 py-2 bg-white shadow rounded-lg">
					<NumericFormat
						className="text-xl font-bold text-indigo-600 truncate"
						value={totalAmountPaid.toDP(2).toNumber()}
						displayType="text"
						prefix="$"
						thousandSeparator
					/>
					<div className="text-sm font-medium">Total Paid</div>
				</div>
			</div>

			{/* Only show comparison stats when we have two scenarios */}
			{comparison && (
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full min-w-0 mb-4">
					<div className={`flex flex-col items-center px-3 py-2 shadow rounded-lg ${comparison.bgColorClass}`}>
						<NumericFormat
							className={`text-xl font-bold truncate ${comparison.colorClass}`}
							value={comparison.value1.toDP(2).toNumber()}
							displayType="text"
							prefix="$"
							thousandSeparator
						/>
						<div className="text-sm font-medium">{comparison.title1}</div>
					</div>

					<div className={`flex flex-col items-center px-3 py-2 shadow rounded-lg ${comparison.bgColorClass}`}>
						<NumericFormat
							className={`text-xl font-bold truncate ${comparison.colorClass}`}
							value={comparison.value2.toDP(2).toNumber()}
							displayType="text"
							prefix="$"
							thousandSeparator
						/>
						<div className="text-sm font-medium">{comparison.title2}</div>
					</div>
				</div>
			)}
		</div>
	)
})

export default AmortizationStats
