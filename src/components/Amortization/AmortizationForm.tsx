import React from 'react';
import { NumberFormatValues, NumericFormat } from 'react-number-format'

interface AmortizationFormProps {
	amount?: number;
	handleAmountChange: (values: NumberFormatValues) => void;
	term?: number;
	handleTermChange: (values: NumberFormatValues) => void;
	rate?: number;
	handleRateChange: (values: NumberFormatValues) => void;
	handleSubmit: (event: React.FormEvent) => void;
}

const AmortizationForm: React.FC<AmortizationFormProps> = ({
	amount,
	handleAmountChange,
	term, handleTermChange,
	rate,
	handleRateChange,
	handleSubmit
}) => {
	return (
		<form onSubmit={handleSubmit} className="mb-6">
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
								value={amount}
								onValueChange={handleAmountChange}
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
						Submit
					</button>
				</div>
			</div>
		</form>
	)
}

export default AmortizationForm
