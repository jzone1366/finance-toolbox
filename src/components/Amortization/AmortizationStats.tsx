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

		// Calculate the difference in periods
		const standardPeriods = standardScenario.periods.length - 1 // Subtract 1 to exclude initial period
		const extraPaymentPeriods = extraPaymentScenario.periods.length - 1 // Subtract 1 to exclude initial period
		const periodDifference = standardPeriods - extraPaymentPeriods

		const difference = {
			interestDifference: standardInterest.minus(extraPaymentInterest),
			totalDifference: standardTotal.minus(extraPaymentTotal),
			periodDifference
		}

		// If this is the standard payment scenario, show additional costs and time
		if (periods === standardScenario.periods) {
			return {
				title1: "Additional Interest Cost",
				title2: "Additional Total Cost",
				title3: "Additional Months",
				value1: difference.interestDifference,
				value2: difference.totalDifference,
				value3: difference.periodDifference,
				colorClass: "text-red-600",
				bgColorClass: "bg-red-50"
			}
		}
		// If this is the extra payment scenario, show savings and time saved
		else {
			return {
				title1: "Interest Saved",
				title2: "Total Amount Saved",
				title3: "Months Saved",
				value1: difference.interestDifference,
				value2: difference.totalDifference,
				value3: difference.periodDifference,
				colorClass: "text-green-600",
				bgColorClass: "bg-green-50"
			}
		}
	}, [scenarios, periods])

	return (
		<div className="space-y-6 sm:space-y-8">
			{/* Main Stats */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
				<div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 px-4 sm:px-6 py-4 sm:py-6">
					<div className="flex flex-col items-center">
						<NumericFormat
							className="text-xl sm:text-2xl md:text-3xl font-semibold text-indigo-600 tracking-tight"
							value={totalInterestPaid.toDP(2).toNumber()}
							displayType="text"
							prefix="$"
							thousandSeparator
						/>
						<div className="text-sm sm:text-base font-medium text-gray-600 mt-1 sm:mt-2">Interest Paid</div>
					</div>
				</div>

				<div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 px-4 sm:px-6 py-4 sm:py-6">
					<div className="flex flex-col items-center">
						<NumericFormat
							className="text-xl sm:text-2xl md:text-3xl font-semibold text-indigo-600 tracking-tight"
							value={totalPrincipalPaid.toDP(2).toNumber()}
							displayType="text"
							prefix="$"
							thousandSeparator
						/>
						<div className="text-sm sm:text-base font-medium text-gray-600 mt-1 sm:mt-2">Principal Paid</div>
					</div>
				</div>

				<div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 px-4 sm:px-6 py-4 sm:py-6">
					<div className="flex flex-col items-center">
						<NumericFormat
							className="text-xl sm:text-2xl md:text-3xl font-semibold text-indigo-600 tracking-tight"
							value={totalAmountPaid.toDP(2).toNumber()}
							displayType="text"
							prefix="$"
							thousandSeparator
						/>
						<div className="text-sm sm:text-base font-medium text-gray-600 mt-1 sm:mt-2">Total Paid</div>
					</div>
				</div>
			</div>

			{/* Comparison Stats */}
			{comparison && (
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
					<div className={`rounded-xl shadow-sm ring-1 ring-gray-900/5 px-4 sm:px-6 py-4 sm:py-6 ${comparison.bgColorClass}`}>
						<div className="flex flex-col items-center">
							<NumericFormat
								className={`text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight ${comparison.colorClass}`}
								value={comparison.value1.toDP(2).toNumber()}
								displayType="text"
								prefix="$"
								thousandSeparator
							/>
							<div className="text-sm sm:text-base font-medium text-gray-600 mt-1 sm:mt-2">{comparison.title1}</div>
						</div>
					</div>

					<div className={`rounded-xl shadow-sm ring-1 ring-gray-900/5 px-4 sm:px-6 py-4 sm:py-6 ${comparison.bgColorClass}`}>
						<div className="flex flex-col items-center">
							<NumericFormat
								className={`text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight ${comparison.colorClass}`}
								value={comparison.value2.toDP(2).toNumber()}
								displayType="text"
								prefix="$"
								thousandSeparator
							/>
							<div className="text-sm sm:text-base font-medium text-gray-600 mt-1 sm:mt-2">{comparison.title2}</div>
						</div>
					</div>

					<div className={`rounded-xl shadow-sm ring-1 ring-gray-900/5 px-4 sm:px-6 py-4 sm:py-6 ${comparison.bgColorClass}`}>
						<div className="flex flex-col items-center">
							<span className={`text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight ${comparison.colorClass}`}>
								{comparison.value3}
							</span>
							<div className="text-sm sm:text-base font-medium text-gray-600 mt-1 sm:mt-2">{comparison.title3}</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
})

export default AmortizationStats
