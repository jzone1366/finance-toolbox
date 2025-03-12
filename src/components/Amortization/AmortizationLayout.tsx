import { useState } from "react"
import Decimal from "decimal.js"
import { NumberFormatValues } from "react-number-format"
import AmortizationForm from "./AmortizationForm"
import AmortizationTable from "./AmortizationTable"
import { calculateInterest, calculateMonthlyRate, calculateTotalPayment } from "./utility_functions"

export type Period = {
	period: number,
	paymentDue?: Decimal | undefined,
	interestDue?: Decimal | undefined,
	principalDue?: Decimal | undefined,
	remainingBalance: Decimal,
}

function buildAmortizationTable(loanAmount: number, apr: number, loanTerm: number) {
	const amount = new Decimal(loanAmount)
	const rate = Decimal.div(Decimal(apr), 100)
	const term = loanTerm * 12

	const intialPeriod: Period = {
		period: 0,
		remainingBalance: amount,
	}

	const payment = calculateTotalPayment(rate, term, amount)
	const monthlyRate: Decimal = calculateMonthlyRate(rate)

	const periods: Period[] = []
	periods.push(intialPeriod)

	for (let i = 1; i <= term; i++) {
		const prevBalance = periods[i - 1].remainingBalance

		const interestDue: Decimal = calculateInterest(monthlyRate, prevBalance)
		const principalDue: Decimal = Decimal.sub(payment, interestDue)
		const remainingBalance: Decimal = Decimal.sub(prevBalance, principalDue)

		const period: Period = {
			period: i,
			paymentDue: payment,
			interestDue: interestDue,
			principalDue: principalDue,
			remainingBalance: remainingBalance,
		}
		periods.push(period)
	}

	return periods
}

function AmortizationLayout() {
	const [loanAmount, setLoanAmount] = useState<number>()
	const [rate, setRate] = useState<number>()
	const [term, setTerm] = useState<number>()
	const [periods, setPeriods] = useState<Period[]>([])

	const handleLoanAmountChange = (values: NumberFormatValues) => {
		setLoanAmount(values.floatValue)
	}

	const handleRateChange = (values: NumberFormatValues) => {
		setRate(values.floatValue)
	}

	const handleTermChange = (values: NumberFormatValues) => {
		setTerm(values.floatValue)
	}

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()
		if (loanAmount && rate && term) {
			setPeriods(buildAmortizationTable(loanAmount, rate, term))
		}
	}

	return (
		<>
			<h1 className="text-xl mb-6">Amortization Schedule</h1>

			<AmortizationForm
				amount={loanAmount}
				handleAmountChange={handleLoanAmountChange}
				term={term}
				handleTermChange={handleTermChange}
				rate={rate}
				handleRateChange={handleRateChange}
				handleSubmit={handleSubmit}
			/>

			<AmortizationTable
				periods={periods}
			/>

		</>
	)
}

export default AmortizationLayout
