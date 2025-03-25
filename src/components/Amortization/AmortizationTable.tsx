import { Period } from "./AmortizationLayout";
import { NumericFormat } from "react-number-format";

interface AmortizationTableProps {
	periods: Period[];
}

const AmortizationTable: React.FC<AmortizationTableProps> = ({ periods }) => {
	if (periods.length < 1) {
		return null
	}

	return (
		<div className="w-full bg-white mt-4 p-2 rounded-lg shadow">
			<div className="overflow-x-auto">
				<table className="min-w-full table-auto text-left text-sm font-light text-surface">
					<thead className="border-b border-neutral-200 font-medium">
						<tr>
							<th scope="col" className="whitespace-nowrap px-6 py-4">Period</th>
							<th scope="col" className="whitespace-nowrap px-6 py-4">Total Payment Due</th>
							<th scope="col" className="whitespace-nowrap px-6 py-4">Computed Interest Due</th>
							<th scope="col" className="whitespace-nowrap px-6 py-4">Principal Due</th>
							<th scope="col" className="whitespace-nowrap px-6 py-4">Principal Balance</th>
						</tr>
					</thead>
					<tbody>
						{periods.map((period) => (
							<tr className="border-b border-neutral-200" key={period.period}>
								<td className="whitespace-nowrap px-6 py-2">{period.period}</td>
								<td className="whitespace-nowrap px-6 py-2">
									<NumericFormat 
										value={period.paymentDue ? period.paymentDue.toDP(2).toNumber() : ''} 
										displayType="text" 
										prefix="$" 
										thousandSeparator 
									/>
								</td>
								<td className="whitespace-nowrap px-6 py-2">
									<NumericFormat 
										value={period.interestDue ? period.interestDue.toDP(2).toNumber() : ''} 
										displayType="text" 
										prefix="$" 
										thousandSeparator 
									/>
								</td>
								<td className="whitespace-nowrap px-6 py-2">
									<NumericFormat 
										value={period.principalDue ? period.principalDue.toDP(2).toNumber() : ''} 
										displayType="text" 
										prefix="$" 
										thousandSeparator 
									/>
								</td>
								<td className="whitespace-nowrap px-6 py-2">
									<NumericFormat 
										value={period.remainingBalance ? period.remainingBalance.toDP(2).toNumber() : ''} 
										displayType="text" 
										prefix="$" 
										thousandSeparator 
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default AmortizationTable
