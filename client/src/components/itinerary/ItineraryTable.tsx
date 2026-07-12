import { useState, type Dispatch, type SetStateAction } from "react"
import type { GetItineraryInterface } from "../../interfaces/itinerary.interface"
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet"

interface ItineraryTableInterface {
	data: GetItineraryInterface[],
	agency_id: string,
	trip_id: string,
	user: any,
}

export const getColumns = (
	role: string,
	//setSelectedTrip: Dispatch<SetStateAction<GetTripInterface | null>>,
	setOpen: Dispatch<SetStateAction<boolean>>,
	setUpdateFlag: Dispatch<SetStateAction<boolean>>,
	setDeleteFlag: Dispatch<SetStateAction<boolean>>,
): ColumnDef<GetItineraryInterface>[] => [
		{
			accessorKey: "srNo",
			header: "Sr. No.",
			cell: (info) => info.row.index + 1
		},
	]

export const ItineraryTable = ({ data, agency_id, trip_id, user }: ItineraryTableInterface) => {

	const [open, setOpen] = useState(false);
	const [updateFlag, setUpdateFlag] = useState(false);
	const [deleteFlag, setDeleteFlag] = useState(false);


	const columns = getColumns(user?.role ?? "", setOpen, setUpdateFlag, setDeleteFlag);

	const table = useReactTable({
		data: data,
		columns: columns,
		getCoreRowModel: getCoreRowModel()
	})

	return (
		<div className="w-full">
			<div className="overflow-hidden rounded-md border">
				<Table>
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

					<Sheet open={open} onOpenChange={setOpen}>
						<SheetContent className="w-full! sm:max-w-xl! lg:max-w-2xl! overflow-y-auto">
							<SheetHeader>
								<SheetTitle>Trip Details</SheetTitle>
							</SheetHeader>

						</SheetContent>
					</Sheet>
				</Table>
			</div>
		</div>
	)
}