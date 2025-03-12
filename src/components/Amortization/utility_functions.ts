import Decimal from "decimal.js"

export function calculateMonthlyRate(rate: Decimal): Decimal {
	return Decimal.div(rate, 12)
}

export function calculateInterest(monthlyRate: Decimal, balance: Decimal): Decimal {
	return balance.times(monthlyRate)
}

export function calculateTotalPayment(rate: Decimal, numberOfPayments: number, loanAmount: Decimal) {
	const monthInterest = calculateMonthlyRate(rate)

	const numerator = monthInterest.times(Decimal.pow(Decimal.add(1, monthInterest), numberOfPayments))
	const denominator = Decimal.sub(Decimal.pow(Decimal.add(1, monthInterest), numberOfPayments), 1)

	const calculation = loanAmount.times(Decimal.div(numerator, denominator))

	return calculation
}

