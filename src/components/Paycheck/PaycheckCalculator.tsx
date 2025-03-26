import { useState, Fragment } from 'react'
import { NumericFormat } from 'react-number-format'
import { MapPinIcon, CalendarIcon, CurrencyDollarIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid'
import { Listbox, Transition } from '@headlessui/react'

type PayFrequency = 'Weekly' | 'Bi-Weekly' | 'Semi-Monthly' | 'Monthly' | 'Annually'
type FilingStatus = 'Single' | 'Married Filing Jointly' | 'Married Filing Separately' | 'Head of Household'
type GrossPayMethod = 'Annually' | 'Monthly' | 'Bi-Weekly' | 'Weekly' | 'Hourly'

interface CustomListboxProps {
  value: { id: string; name: string };
  onChange: (value: any) => void;
  options: Array<{ id: string; name: string }>;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export default function PaycheckCalculator() {
  const [grossPay, setGrossPay] = useState<number>()
  const [selectedGrossPayMethod, setSelectedGrossPayMethod] = useState<{ id: GrossPayMethod; name: string }>({ 
    id: 'Annually', 
    name: 'Annually' 
  })
  const [grossPayYTD, setGrossPayYTD] = useState<number>()
  const [selectedPayFrequency, setSelectedPayFrequency] = useState<{ id: PayFrequency; name: string }>({ 
    id: 'Weekly', 
    name: 'Weekly' 
  })
  const [selectedFilingStatus, setSelectedFilingStatus] = useState<{ id: FilingStatus; name: string }>({ 
    id: 'Single', 
    name: 'Single' 
  })
  const [hasTwoJobs, setHasTwoJobs] = useState(false)
  const [dependentsAmount, setDependentsAmount] = useState<number>()
  const [otherIncome, setOtherIncome] = useState<number>()
  const [deductions, setDeductions] = useState<number>()
  const [additionalWithholding, setAdditionalWithholding] = useState<number>()
  const [roundWithholding, setRoundWithholding] = useState(false)
  const [isExemptFederal, setIsExemptFederal] = useState(false)
  const [isExemptSS, setIsExemptSS] = useState(false)
  const [isExemptMedicare, setIsExemptMedicare] = useState(false)
  const [selectedState, setSelectedState] = useState({ id: 'federal', name: 'Federal taxes only' })

  const states = [
    { id: 'federal', name: 'Federal taxes only' },
    // Add more states here later
  ]

  const grossPayMethods = [
    { id: 'Annually' as const, name: 'Annually' },
    { id: 'Monthly' as const, name: 'Monthly' },
    { id: 'Bi-Weekly' as const, name: 'Bi-Weekly' },
    { id: 'Weekly' as const, name: 'Weekly' },
    { id: 'Hourly' as const, name: 'Hourly' },
  ]

  const payFrequencies = [
    { id: 'Weekly' as const, name: 'Weekly' },
    { id: 'Bi-Weekly' as const, name: 'Bi-Weekly' },
    { id: 'Semi-Monthly' as const, name: 'Semi-Monthly' },
    { id: 'Monthly' as const, name: 'Monthly' },
    { id: 'Annually' as const, name: 'Annually' },
  ]

  const filingStatuses = [
    { id: 'Single' as const, name: 'Single' },
    { id: 'Married Filing Jointly' as const, name: 'Married Filing Jointly' },
    { id: 'Married Filing Separately' as const, name: 'Married Filing Separately' },
    { id: 'Head of Household' as const, name: 'Head of Household' },
  ]

  const CustomListbox = ({ value, onChange, options, label, icon: Icon }: CustomListboxProps) => (
    <div>
      <label className="flex items-center text-sm font-medium leading-6 text-gray-900 mb-2">
        {Icon && <Icon className="h-5 w-5 text-gray-400 mr-2" />}
        {label}
      </label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-3 pl-4 pr-10 text-left ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
            <span className="block truncate">{value.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((option: any) => (
                <Listbox.Option
                  key={option.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-indigo-50 text-indigo-900' : 'text-gray-900'
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {option.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add form submission logic here using selectedGrossPayMethod.id, selectedPayFrequency.id, selectedFilingStatus.id
  }

  return (
    <div className="mx-auto w-full px-2 py-4 sm:px-3 md:px-4 lg:max-w-[98%] xl:max-w-3xl">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          2025 Salary Paycheck Calculator - US Federal
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Calculate your net pay or take-home pay by entering your per-period or annual salary along with the pertinent federal, state, and local W4 information.
        </p>
      </div>

      <form className="mt-6" onSubmit={handleSubmit}>
        <div className="overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
          <div className="p-3 sm:p-4 md:p-6">
            {/* State & Date Section */}
            <div className="mb-8">
              <h3 className="text-base font-semibold leading-6 text-gray-900 bg-gray-50 px-4 py-2 rounded-lg mb-4">
                State & Date
              </h3>
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <div>
                  <label className="flex items-center text-sm font-medium leading-6 text-gray-900 mb-2">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                    State
                  </label>
                  <Listbox value={selectedState} onChange={setSelectedState}>
                    <div className="relative">
                      <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-3 pl-4 pr-10 text-left ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                        <span className="block truncate">{selectedState.name}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {states.map((state) => (
                            <Listbox.Option
                              key={state.id}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                  active ? 'bg-indigo-50 text-indigo-900' : 'text-gray-900'
                                }`
                              }
                              value={state}
                            >
                              {({ selected }) => (
                                <>
                                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                    {state.name}
                                  </span>
                                  {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                </div>

                <div>
                  <label htmlFor="check-date" className="flex items-center text-sm font-medium leading-6 text-gray-900 mb-2">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                    Check Date
                  </label>
                  <input
                    type="date"
                    id="check-date"
                    className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue="2025-03-26"
                  />
                </div>
              </div>
            </div>

            {/* Earnings Section */}
            <div className="mb-8">
              <h3 className="text-base font-semibold leading-6 text-gray-900 bg-gray-50 px-4 py-2 rounded-lg mb-4">
                Earnings
              </h3>
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="gross-pay" className="flex items-center text-sm font-medium leading-6 text-gray-900 mb-2">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
                    Gross Pay
                  </label>
                  <NumericFormat
                    id="gross-pay"
                    thousandSeparator={true}
                    prefix="$"
                    placeholder="Enter amount"
                    className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={grossPay}
                    onValueChange={(values) => setGrossPay(values.floatValue)}
                  />
                </div>

                <div>
                  <CustomListbox
                    value={selectedGrossPayMethod}
                    onChange={setSelectedGrossPayMethod}
                    options={grossPayMethods}
                    label="Gross Pay Method"
                    icon={ClipboardDocumentListIcon}
                  />
                </div>

                <div>
                  <CustomListbox
                    value={selectedPayFrequency}
                    onChange={setSelectedPayFrequency}
                    options={payFrequencies}
                    label="Pay Frequency"
                    icon={CalendarIcon}
                  />
                </div>

                <div>
                  <label htmlFor="gross-pay-ytd" className="flex items-center text-sm font-medium leading-6 text-gray-900 mb-2">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
                    Gross Pay YTD
                  </label>
                  <NumericFormat
                    id="gross-pay-ytd"
                    thousandSeparator={true}
                    prefix="$"
                    placeholder="Enter amount"
                    className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={grossPayYTD}
                    onValueChange={(values) => setGrossPayYTD(values.floatValue)}
                  />
                </div>
              </div>
            </div>

            {/* Federal Taxes Section */}
            <div className="mb-8">
              <h3 className="text-base font-semibold leading-6 text-gray-900 bg-gray-50 px-4 py-2 rounded-lg mb-4">
                Federal Taxes (enter your W4 info)
              </h3>
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <div>
                  <CustomListbox
                    value={selectedFilingStatus}
                    onChange={setSelectedFilingStatus}
                    options={filingStatuses}
                    label="Filing Status"
                  />
                </div>

                <div className="flex items-center">
                  <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                      <input
                        id="two-jobs"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        checked={hasTwoJobs}
                        onChange={(e) => setHasTwoJobs(e.target.checked)}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="two-jobs" className="text-sm font-medium leading-6 text-gray-900">
                        Step 2: Two Jobs
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="dependents-amount" className="flex items-center text-sm font-medium leading-6 text-gray-900 mb-2">
                    Step 3: Dependents Amount
                  </label>
                  <NumericFormat
                    id="dependents-amount"
                    thousandSeparator={true}
                    prefix="$"
                    placeholder="Enter amount"
                    className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={dependentsAmount}
                    onValueChange={(values) => setDependentsAmount(values.floatValue)}
                  />
                </div>

                <div>
                  <label htmlFor="other-income" className="flex items-center text-sm font-medium leading-6 text-gray-900 mb-2">
                    Step 4a: Other Income
                  </label>
                  <NumericFormat
                    id="other-income"
                    thousandSeparator={true}
                    prefix="$"
                    placeholder="Enter amount"
                    className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={otherIncome}
                    onValueChange={(values) => setOtherIncome(values.floatValue)}
                  />
                </div>

                <div>
                  <label htmlFor="deductions" className="flex items-center text-sm font-medium leading-6 text-gray-900 mb-2">
                    Step 4b: Deductions
                  </label>
                  <NumericFormat
                    id="deductions"
                    thousandSeparator={true}
                    prefix="$"
                    placeholder="Enter amount"
                    className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={deductions}
                    onValueChange={(values) => setDeductions(values.floatValue)}
                  />
                </div>

                <div>
                  <label htmlFor="additional-withholding" className="flex items-center text-sm font-medium leading-6 text-gray-900 mb-2">
                    Additional Federal Withholding
                  </label>
                  <NumericFormat
                    id="additional-withholding"
                    thousandSeparator={true}
                    prefix="$"
                    placeholder="Enter amount"
                    className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={additionalWithholding}
                    onValueChange={(values) => setAdditionalWithholding(values.floatValue)}
                  />
                </div>

                <div className="sm:col-span-2 space-y-4">
                  <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                      <input
                        id="round-withholding"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        checked={roundWithholding}
                        onChange={(e) => setRoundWithholding(e.target.checked)}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="round-withholding" className="text-sm font-medium leading-6 text-gray-900">
                        Round Federal Withholding
                      </label>
                    </div>
                  </div>

                  <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                      <input
                        id="exempt-federal"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        checked={isExemptFederal}
                        onChange={(e) => setIsExemptFederal(e.target.checked)}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="exempt-federal" className="text-sm font-medium leading-6 text-gray-900">
                        Exempt from Federal Withholding
                      </label>
                    </div>
                  </div>

                  <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                      <input
                        id="exempt-ss"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        checked={isExemptSS}
                        onChange={(e) => setIsExemptSS(e.target.checked)}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="exempt-ss" className="text-sm font-medium leading-6 text-gray-900">
                        Exempt from Social Security
                      </label>
                    </div>
                  </div>

                  <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                      <input
                        id="exempt-medicare"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        checked={isExemptMedicare}
                        onChange={(e) => setIsExemptMedicare(e.target.checked)}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="exempt-medicare" className="text-sm font-medium leading-6 text-gray-900">
                        Exempt from Medicare
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full rounded-lg bg-indigo-600 px-6 py-3.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200"
              >
                Calculate Paycheck
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
} 