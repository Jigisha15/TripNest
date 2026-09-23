import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import type { GetBookingInterface } from "../../interfaces/booking.interface"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { formatDate } from "../../utils/formateDate"
import { Badge } from "../ui/badge"

interface BookingTablePageInterface {
	bookingData: GetBookingInterface,
	user_id: string
}

const getColumns = (
	bookingData: GetBookingInterface
): ColumnDef<GetBookingInterface>[] => [
		{
			id: "srNo",
			header: 'Sr. No.',
			cell: (info) => info.row.index + 1
		},
		{
			accessorKey: "trip_id",
			header: "Trip Name",
			cell: ({ row }) => {
				return (
					<div className="">{row.original.trip.title}</div>
				)
			}
		},
		{
			accessorKey: "booking_status",
			header: "Booking Status",
			cell: ({ row }) => {
				const booking_status = row.original.booking_status;

				return (
					<div>
						<Badge
							className={`
                        px-2 py-1
                        ${booking_status === "CONFIRMED"
									? "bg-green-100 text-green-700 border-green-200"
									: booking_status === "REFUNDED"
										? "bg-blue-100 text-blue-700 border-blue-200"
										: booking_status === "CANCELLED" ||
											booking_status === "REJECTED"
											? "bg-red-100 text-red-700 border-red-200"
											: "bg-yellow-100 text-yellow-700 border-yellow-200"
								}
                        `}
						>
							{booking_status}
						</Badge>
					</div>
				);
			},
		},
		{
			accessorKey: "payment_status",
			header: "Payment Status",
			cell: ({ row }) => {
				const payment_status = row.original.payment_status;

				return (
					<div>
						<Badge
							className={`
                        px-2 py-1
                        ${payment_status === "PAID"
									? "bg-green-100 text-green-700 border-green-200"
									: payment_status === "REFUNDED"
										? "bg-blue-100 text-blue-700 border-blue-200"
										: "bg-yellow-100 text-yellow-700 border-yellow-200"
								}
                        `}
						>
							{payment_status}
						</Badge>
					</div>
				);
			},
		},
		{
			accessorKey: "total_amount",
			header: "Payment Amount",
			cell: ({ row }) => {
				return (
					<div className="">Rs. {row.original.total_amount}</div>
				)
			}
		},
		{
			accessorKey: "created_at",
			header: "Payment Date",
			cell: ({ row }) => {
				const date = formatDate(row.original.created_at)
				return (
					<div className="">{date}</div>
				)
			}
		},
		{
			accessorKey: "trip_date",
			header: "Trip Status",
			cell: ({ row }) => {
				const endDate = new Date(row.original.trip.end_date);
				const today = new Date();

				const isCompleted = today >= endDate;

				return (
					<div>
						{isCompleted ? (
							<div className="text-red-600">
								Trip is Over
							</div>
						) : (
							<div className="text-green-600">
								Trip is not Over
							</div>
						)}
					</div>
				);
			},
		},
	]

export const BookingTable = ({ bookingData, user_id }: BookingTablePageInterface) => {

	const columns = getColumns(bookingData)

	const table = useReactTable({
		data: bookingData,
		columns,
		getCoreRowModel: getCoreRowModel()
	})

	return (
		<div className="w-full">
			<div className="overflow-hidden rounded-md">
				<Table className="border">
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup: any) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header: any) => {
									return (
										<TableHead key={header.id} className="bg-gray-100">
											{header.isPlaceholder
												? null
												: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>

					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row: any) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell: any) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}