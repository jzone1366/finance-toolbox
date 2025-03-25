import { useState } from "react"
import Decimal from "decimal.js"
import { NumberFormatValues } from "react-number-format"
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
			const extraPaymentScenario = buildAmortizationTable(loanAmount, rate, term, extraPayment ?? 0)
			
			setScenarios([
				{ periods: standardScenario, label: "Standard Payment" },
				{ periods: extraPaymentScenario, label: "With Extra Payment" }
			])
		}
	}

	return (
		<div className="container">
			<h1 className="text-xl mb-6">Amortization Schedule</h1>

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
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{scenarios.map((scenario, index) => (
							<div key={index} className="space-y-4">
								<h2 className="text-lg font-semibold">{scenario.label}</h2>
								<AmortizationStats
									periods={scenario.periods}
									scenarios={scenarios}
								/>
								<AmortizationPieChart
									periods={scenario.periods}
									label={scenario.label}
								/>
								<AmortizationGraph
									periods={scenario.periods}
									label={scenario.label}
								/>
								<AmortizationTable
									periods={scenario.periods}
								/>
							</div>
						))}
					</div>
				</>
			)}
		</div>
	)
}

export default AmortizationLayout
