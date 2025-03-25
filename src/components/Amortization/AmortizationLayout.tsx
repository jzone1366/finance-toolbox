import { useState } from "react"
import Decimal from "decimal.js"
import { NumberFormatValues } from "react-number-format"
import { Tab } from '@headlessui/react'
import AmortizationForm from "./AmortizationForm"
import AmortizationTable from "./AmortizationTable"
import { calculateInterest, calculateMonthlyRate, calculateTotalPayment } from "./utility_functions"
import AmortizationStats from "./AmortizationStats"
import AmortizationGraph from "./AmortizationGraph"
import AmortizationPieChart from "./AmortizationPieChart"

export type Period = {
	period: number,
	paymentDue?: Decimal | undefined,
	interestDue?: Decimal | undefined,
	principalDue?: Decimal | undefined,
	remainingBalance: Decimal,
}

export type AmortizationScenario = {
	periods: Period[],
	label: string,
}

function buildAmortizationTable(loanAmount: number, apr: number, loanTerm: number, extraPayment: number) {
	const amount = new Decimal(loanAmount)
	const rate = Decimal.div(Decimal(apr), 100)
	const term = loanTerm * 12
	const extraPaymentDecimal = new Decimal(extraPayment || 0)

	const intialPeriod: Period = {
		period: 0,
		remainingBalance: amount,
	}

	const payment = calculateTotalPayment(rate, term, amount)
	const monthlyRate: Decimal = calculateMonthlyRate(rate)

	const periods: Period[] = []
	periods.push(intialPeriod)

	let currentPeriod = 1
	let remainingBalance = amount

	while (currentPeriod <= term && remainingBalance.gt(0)) {
		const prevBalance = periods[currentPeriod - 1].remainingBalance

		const interestDue: Decimal = calculateInterest(monthlyRate, prevBalance)
		let principalDue: Decimal = Decimal.sub(payment, interestDue)
		
		// Add extra payment to principal
		principalDue = principalDue.plus(extraPaymentDecimal)
		
		// Calculate remaining balance after this payment
		remainingBalance = Decimal.sub(prevBalance, principalDue)
		
		// If remaining balance would go negative, adjust principal payment
		if (remainingBalance.lt(0)) {
			principalDue = prevBalance.plus(interestDue)
			remainingBalance = new Decimal(0)
		}

		const paymentDue = principalDue.plus(interestDue)

		const period: Period = {
			period: currentPeriod,
			paymentDue: paymentDue,
			interestDue: interestDue,
			principalDue: principalDue,
			remainingBalance: remainingBalance,
		}

		periods.push(period)
		currentPeriod++
	}

	return periods
}

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ')
}

function AmortizationLayout() {
	const [loanAmount, setLoanAmount] = useState<number>()
	const [rate, setRate] = useState<number>()
	const [term, setTerm] = useState<number>()
	const [extraPayment, setExtraPayment] = useState<number>()
	const [scenarios, setScenarios] = useState<AmortizationScenario[]>([])

	const handleLoanAmountChange = (values: NumberFormatValues) => {
		setLoanAmount(values.floatValue)
	}

	const handleRateChange = (values: NumberFormatValues) => {
		setRate(values.floatValue)
	}

	const handleTermChange = (values: NumberFormatValues) => {
		setTerm(values.floatValue)
	}

	const handleExtraPaymentChange = (values: NumberFormatValues) => {
		setExtraPayment(values.floatValue)
	}

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()
		if (loanAmount && rate && term) {
			const standardScenario = buildAmortizationTable(loanAmount, rate, term, 0)
			const hasExtraPayment = extraPayment && extraPayment > 0
			
			if (hasExtraPayment) {
				const extraPaymentScenario = buildAmortizationTable(loanAmount, rate, term, extraPayment)
				setScenarios([
					{ periods: standardScenario, label: "Standard Payment" },
					{ periods: extraPaymentScenario, label: "With Extra Payment" }
				])
			} else {
				setScenarios([
					{ periods: standardScenario, label: "Standard Payment" }
				])
			}
		}
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<AmortizationForm
				amount={loanAmount}
				handleAmountChange={handleLoanAmountChange}
				term={term}
				handleTermChange={handleTermChange}
				rate={rate}
				handleRateChange={handleRateChange}
				extraPayment={extraPayment}
				handleExtraPaymentChange={handleExtraPaymentChange}
				handleSubmit={handleSubmit}
			/>

			{scenarios.length > 0 && (
				<div className="mx-auto w-full px-2 pb-6 sm:px-3 md:px-4 lg:max-w-[98%] xl:max-w-7xl">
					{/* Show tabs on smaller screens, grid on xl screens */}
					<div className="xl:hidden">
						<Tab.Group>
							<Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1 mb-4">
								{scenarios.map((scenario, index) => (
									<Tab
										key={index}
										className={({ selected }) =>
											classNames(
												'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
												'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
												selected
													? 'bg-white text-indigo-600 shadow'
													: 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
											)
										}
									>
										{scenario.label}
									</Tab>
								))}
							</Tab.List>
							<Tab.Panels>
								{scenarios.map((scenario, index) => (
									<Tab.Panel key={index}>
										<div className="space-y-4 sm:space-y-6">
											<div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-3 sm:p-4 md:p-6">
												<h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">{scenario.label}</h2>
												<AmortizationStats
													periods={scenario.periods}
													scenarios={scenarios.length > 1 ? scenarios : undefined}
												/>
												<div className="mt-4 sm:mt-6">
													<AmortizationPieChart
														periods={scenario.periods}
														label={scenario.label}
													/>
												</div>
												<div className="mt-4 sm:mt-6">
													<AmortizationGraph
														periods={scenario.periods}
														label={scenario.label}
													/>
												</div>
												<div className="mt-4 sm:mt-6">
													<h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3">Amortization Schedule</h3>
													<AmortizationTable
														periods={scenario.periods}
													/>
												</div>
											</div>
										</div>
									</Tab.Panel>
								))}
							</Tab.Panels>
						</Tab.Group>
					</div>

					{/* Show grid layout on xl screens */}
					<div className="hidden xl:grid xl:grid-cols-2 gap-6">
						{scenarios.map((scenario, index) => (
							<div key={index} className="space-y-4 sm:space-y-6">
								<div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-3 sm:p-4 md:p-6">
									<h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">{scenario.label}</h2>
									<AmortizationStats
										periods={scenario.periods}
										scenarios={scenarios.length > 1 ? scenarios : undefined}
									/>
									<div className="mt-4 sm:mt-6">
										<AmortizationPieChart
											periods={scenario.periods}
											label={scenario.label}
										/>
									</div>
									<div className="mt-4 sm:mt-6">
										<AmortizationGraph
											periods={scenario.periods}
											label={scenario.label}
										/>
									</div>
									<div className="mt-4 sm:mt-6">
										<h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3">Amortization Schedule</h3>
										<AmortizationTable
											periods={scenario.periods}
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

export default AmortizationLayout
