import { Period } from "./AmortizationLayout";
import { NumericFormat } from "react-number-format";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

interface AmortizationTableProps {
	periods: Period[];
}

const AmortizationTable: React.FC<AmortizationTableProps> = ({ periods }) => {
	const tableContainerRef = useRef<HTMLDivElement>(null)

	const columnHelper = createColumnHelper<Period>()

	const columns = [
		columnHelper.accessor('period', {
			header: 'Period',
			cell: info => info.getValue(),
		}),
		columnHelper.accessor(row => row.paymentDue?.toDP(2).toNumber() ?? '', {
			id: 'paymentDue',
			header: 'Total Payment Due',
			cell: info => (
				<NumericFormat
					value={info.getValue()}
					displayType="text"
					prefix="$"
					thousandSeparator
				/>
			),
		}),
		columnHelper.accessor(row => row.interestDue?.toDP(2).toNumber() ?? '', {
			id: 'interestDue',
			header: 'Computed Interest Due',
			cell: info => (
				<NumericFormat
					value={info.getValue()}
					displayType="text"
					prefix="$"
					thousandSeparator
				/>
			),
		}),
		columnHelper.accessor(row => row.principalDue?.toDP(2).toNumber() ?? '', {
			id: 'principalDue',
			header: 'Principal Due',
			cell: info => (
				<NumericFormat
					value={info.getValue()}
					displayType="text"
					prefix="$"
					thousandSeparator
				/>
			),
		}),
		columnHelper.accessor(row => row.remainingBalance.toDP(2).toNumber(), {
			id: 'remainingBalance',
			header: 'Principal Balance',
			cell: info => (
				<NumericFormat
					value={info.getValue()}
					displayType="text"
					prefix="$"
					thousandSeparator
				/>
			),
		}),
	]

	const table = useReactTable({
		data: periods,
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	const { rows } = table.getRowModel()

	const rowVirtualizer = useVirtualizer({
		count: rows.length,
		getScrollElement: () => tableContainerRef.current,
		estimateSize: () => 32, // Reduced from 41 to make rows more compact
		overscan: 10,
	})

	const virtualRows = rowVirtualizer.getVirtualItems()
	const totalSize = rowVirtualizer.getTotalSize()
	const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0
	const paddingBottom =
		virtualRows.length > 0
			? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
			: 0

	return (
		<div className="w-full bg-white mt-4 p-2 rounded-lg shadow">
			<div
				ref={tableContainerRef}
				className="overflow-auto"
				style={{
					height: '600px', // Increased from 400px
					width: '100%'
				}}
			>
				<table className="min-w-full table-auto text-left text-sm font-light text-surface">
					<thead className="border-b border-neutral-200 font-medium sticky top-0 bg-white z-10">
						{table.getHeaderGroups().map(headerGroup => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map(header => (
									<th key={header.id} className="whitespace-nowrap px-4 py-3 text-sm">
										{header.isPlaceholder
											? null
											: flexRender(
												header.column.columnDef.header,
												header.getContext()
											)}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{paddingTop > 0 && (
							<tr>
								<td style={{ height: `${paddingTop}px` }} colSpan={columns.length} />
							</tr>
						)}
						{virtualRows.map(virtualRow => {
							const row = rows[virtualRow.index]
							return (
								<tr key={row.id} className="border-b border-neutral-200">
									{row.getVisibleCells().map(cell => (
										<td key={cell.id} className="whitespace-nowrap px-4 py-1.5">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</td>
									))}
								</tr>
							)
						})}
						{paddingBottom > 0 && (
							<tr>
								<td style={{ height: `${paddingBottom}px` }} colSpan={columns.length} />
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default AmortizationTable
