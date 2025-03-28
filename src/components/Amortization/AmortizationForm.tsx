import React, { useState, useEffect } from 'react';
import { NumberFormatValues, NumericFormat } from 'react-number-format'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { BanknotesIcon, CalendarIcon, CalculatorIcon } from '@heroicons/react/24/outline'

interface FormErrors {
	amount: string;
	term: string;
	rate: string;
}

interface AmortizationFormProps {
	amount?: number;
	handleAmountChange: (values: NumberFormatValues) => void;
	term?: number;
	handleTermChange: (values: NumberFormatValues) => void;
	rate?: number;
	handleRateChange: (values: NumberFormatValues) => void;
	extraPayment?: number;
	handleExtraPaymentChange: (values: NumberFormatValues) => void;
	handleSubmit: (event: React.FormEvent) => void;
}

const AmortizationForm: React.FC<AmortizationFormProps> = ({
	amount, handleAmountChange,
	term, handleTermChange,
	rate, handleRateChange,
	extraPayment, handleExtraPaymentChange,
	handleSubmit: propHandleSubmit
}) => {
	const [errors, setErrors] = useState<FormErrors>({
		amount: '',
		term: '',
		rate: ''
	});

	const [touched, setTouched] = useState({
		amount: false,
		term: false,
		rate: false
	});

	const validateField = (name: keyof FormErrors, value: number | undefined) => {
		if (value === undefined || value === 0) {
			return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
		}
		if (value < 0) {
			return `${name.charAt(0).toUpperCase() + name.slice(1)} must be positive`;
		}
		if (name === 'rate' && (value < 0 || value > 100)) {
			return 'Interest rate must be between 0 and 100';
		}
		return '';
	};

	useEffect(() => {
		setErrors({
			amount: touched.amount ? validateField('amount', amount) : '',
			term: touched.term ? validateField('term', term) : '',
			rate: touched.rate ? validateField('rate', rate) : ''
		});
	}, [amount, term, rate, touched]);

	const handleBlur = (field: keyof typeof touched) => {
		setTouched(prev => ({ ...prev, [field]: true }));
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();

		// Mark all fields as touched
		setTouched({
			amount: true,
			term: true,
			rate: true
		});

		// Validate all fields
		const newErrors = {
			amount: validateField('amount', amount),
			term: validateField('term', term),
			rate: validateField('rate', rate)
		};

		setErrors(newErrors);

		// Only submit if there are no errors
		if (!Object.values(newErrors).some(error => error !== '')) {
			propHandleSubmit(event);
		}
	};

	return (
		<div className="bg-gray-50">
			<div className="mx-auto w-full px-2 py-4 sm:px-3 md:px-4 lg:max-w-[98%] xl:max-w-3xl">
				<div className="text-center">
					<h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Loan Calculator</h2>
					<p className="mt-2 text-sm leading-6 text-gray-600">
						Calculate your loan payments and amortization schedule
					</p>
				</div>

				<form onSubmit={handleSubmit} className="mt-6">
					<div className="overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
						<div className="p-3 sm:p-4 md:p-6">
							<div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:gap-x-6 sm:gap-y-6 sm:grid-cols-2">
								{/* Loan Amount Field */}
								<div className="sm:col-span-2">
									<div className="relative">
										<label htmlFor="loan-amount"
											className="flex items-center text-sm font-medium leading-6 text-gray-900 mb-2">
											<BanknotesIcon className="h-5 w-5 text-gray-400 mr-2" />
											Loan Amount
										</label>
										<div className="relative rounded-lg">
											<NumericFormat
												id="loan-amount"
												name="loan-amount"
												thousandSeparator={true}
												prefix={"$"}
												displayType="input"
												placeholder="Enter amount"
												className={`block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ${errors.amount ? 'ring-red-300 placeholder:text-red-300 focus:ring-red-500'
													: 'ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600'
													} focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
												value={amount}
												onValueChange={handleAmountChange}
												onBlur={() => handleBlur('amount')}
											/>
											{errors.amount && (
												<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
													<ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
												</div>
											)}
										</div>
										{errors.amount && touched.amount && (
											<p className="mt-2 text-sm text-red-600">{errors.amount}</p>
										)}
									</div>
								</div>

								{/* Interest Rate Field */}
								<div>
									<div className="relative">
										<label htmlFor="loan-apr"
											className="flex items-center text-sm font-medium leading-6 text-gray-900 mb-2">
											<CalculatorIcon className="h-5 w-5 text-gray-400 mr-2" />
											Interest Rate (APR)
										</label>
										<div className="relative rounded-lg">
											<NumericFormat
												id="loan-apr"
												name="loan-apr"
												suffix="%"
												displayType="input"
												placeholder="Enter rate"
												decimalScale={2}
												allowNegative={false}
												className={`block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ${errors.rate ? 'ring-red-300 placeholder:text-red-300 focus:ring-red-500'
													: 'ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600'
													} focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
												value={rate}
												onValueChange={handleRateChange}
												onBlur={() => handleBlur('rate')}
											/>
											{errors.rate && (
												<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
													<ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
												</div>
											)}
										</div>
										{errors.rate && touched.rate && (
											<p className="mt-2 text-sm text-red-600">{errors.rate}</p>
										)}
									</div>
								</div>

								{/* Loan Term Field */}
								<div>
									<div className="relative">
										<label htmlFor="loan-term"
											className="flex items-center text-sm font-medium leading-6 text-gray-900 mb-2">
											<CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
											Loan Term
										</label>
										<div className="relative rounded-lg">
											<NumericFormat
												id="loan-term"
												name="loan-term"
												displayType="input"
												placeholder="Years"
												allowNegative={false}
												decimalScale={0}
												className={`block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ${errors.term ? 'ring-red-300 placeholder:text-red-300 focus:ring-red-500'
													: 'ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600'
													} focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
												value={term}
												onValueChange={handleTermChange}
												onBlur={() => handleBlur('term')}
											/>
											{errors.term && (
												<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
													<ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
												</div>
											)}
										</div>
										{errors.term && touched.term && (
											<p className="mt-2 text-sm text-red-600">{errors.term}</p>
										)}
									</div>
								</div>

								{/* Optional Fields Section */}
								<div className="sm:col-span-2">
									<Disclosure>
										{({ open }) => (
											<div className="rounded-lg bg-gray-50 ring-1 ring-gray-200 transition-shadow hover:ring-gray-300">
												<Disclosure.Button className="flex w-full justify-between rounded-lg px-4 py-3 text-left text-sm font-medium text-indigo-600 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-75">
													<span className="flex items-center">
														<span>{open ? 'Hide Optional Fields' : 'Show Optional Fields'}</span>
													</span>
													<ChevronUpIcon
														className={`${open ? 'rotate-180 transform' : ''
															} h-5 w-5 text-indigo-500 transition-transform duration-200`}
													/>
												</Disclosure.Button>
												<Disclosure.Panel className="px-4 pb-4">
													<div className="mt-4">
														<label htmlFor="extra-payment"
															className="flex items-center text-sm font-medium leading-6 text-gray-900 mb-2">
															Extra Principal Payment
														</label>
														<div className="relative rounded-lg">
															<NumericFormat
																id="extra-payment"
																name="extra-payment"
																displayType="input"
																placeholder="Monthly amount"
																thousandSeparator={true}
																prefix={"$"}
																className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
																value={extraPayment}
																onValueChange={handleExtraPaymentChange}
															/>
														</div>
													</div>
												</Disclosure.Panel>
											</div>
										)}
									</Disclosure>
								</div>
							</div>

							{/* Submit Button */}
							<div className="mt-6">
								<button
									type="submit"
									className="w-full rounded-lg bg-indigo-600 px-6 py-3.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200"
								>
									Calculate Payment
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}

export default AmortizationForm
