import { useState } from "react"
import Decimal from "decimal.js"
import { NumberFormatValues, NumericFormat } from "react-number-format"

//@TODO: Need to break this down. It's alot to grok.
type Period = {
	period: number,
	paymentDue?: Decimal | undefined,
	interestDue?: Decimal | undefined,
	principalDue?: Decimal | undefined,
	remainingBalance: Decimal,
}

// Functions below this point are utilities ------
function calculateMonthlyRate(rate: Decimal): Decimal {
	return Decimal.div(rate, 12)
}

function calculateInterest(monthlyRate: Decimal, balance: Decimal): Decimal {
	return balance.times(monthlyRate)
}

function calculateTotalPayment(rate: Decimal, numberOfPayments: number, loanAmount: Decimal) {
	const monthInterest = calculateMonthlyRate(rate)

	const numerator = monthInterest.times(Decimal.pow(Decimal.add(1, monthInterest), numberOfPayments))
	const denominator = Decimal.sub(Decimal.pow(Decimal.add(1, monthInterest), numberOfPayments), 1)

	const calculation = loanAmount.times(Decimal.div(numerator, denominator))

	return calculation
}
// End Utility function

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

			<form onSubmit={handleSubmit}>
				<div className="border rounded-sm border-neutral-400 p-3">
					<div className="m-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9">
						<div className="sm:col-span-3">
							<label htmlFor="loan-amount" className="block text-sm/6 font-medium text-gray-900">
								Loan Amount:
							</label>
							<div className="mt-2">
								<NumericFormat
									id="loan-amount"
									name="loan-amount"
									thousandSeparator={true}
									prefix={"$"}
									displayType="input"
									placeholder="Enter Amount"
									className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
									value={loanAmount}
									onValueChange={handleLoanAmountChange}
								/>
							</div>
						</div>

						<div className="sm:col-span-3">
							<label htmlFor="loan-apr" className="block text-sm/6 font-medium text-gray-900">
								Loan APR (%):
							</label>
							<div className="mt-2">
								<NumericFormat
									id="loan-apr"
									name="loan-apr"
									suffix="%"
									displayType="input"
									placeholder="Enter APR %"
									className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
									value={rate}
									step="0.01"
									onValueChange={handleRateChange}
								/>
							</div>
						</div>

						<div className="sm:col-span-3">
							<label htmlFor="loan-term" className="block text-sm/6 font-medium text-gray-900">
								Loan Term (Years):
							</label>
							<div className="mt-2">
								<NumericFormat
									id="loan-term"
									name="loan-term"
									displayType="input"
									placeholder="Enter Loan Term in Years"
									className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
									value={term}
									onValueChange={handleTermChange}
								/>
							</div>
						</div>
					</div>

					<div className="mt-6 flex items-center justify-end gap-x-6">
						<button
							type="submit"
							className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
							submit
						</button>
					</div>
				</div>
			</form>

			<table className="min-w-full table-auto text-left text-sm font-light text-surface ">
				<thead className="border-b border-neutral-200 font-medium ">
					<tr>
						<th scope="col" className="px-6 py-4"> Period </th>
						<th scope="col" className="px-6 py-4"> Total Payment Due </th>
						<th scope="col" className="px-6 py-4"> Computed Interest Due </th>
						<th scope="col" className="px-6 py-4"> Principal Due </th>
						<th scope="col" className="px-6 py-4"> Principal Balance </th>
					</tr>
				</thead>
				<tbody>
					{periods.map((period) => (
						<tr className="border-b border-neutral-200" key={period.period}>
							<td className="px-6 py-2">{period.period}</td>
							<td className="px-6 py-2"><NumericFormat value={period.paymentDue ? period.paymentDue.toDP(2).toNumber() : ''} displayType="text" prefix="$" thousandSeparator /></td>
							<td className="px-6 py-2"><NumericFormat value={period.interestDue ? period.interestDue.toDP(2).toNumber() : ''} displayType="text" prefix="$" thousandSeparator /></td>
							<td className="px-6 py-2"><NumericFormat value={period.principalDue ? period.principalDue.toDP(2).toNumber() : ''} displayType="text" prefix="$" thousandSeparator /></td>
							<td className="px-6 py-2"><NumericFormat value={period.remainingBalance ? period.remainingBalance.toDP(2).toNumber() : ''} displayType="text" prefix="$" thousandSeparator /></td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	)
}

export default AmortizationLayout
