import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import type { GetTripInterface } from "../../interfaces/trips.interface"
import { useSelector } from "react-redux"
import type { RootState } from "../../app/store"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Button } from "../ui/button"
import { Eye, Pencil, Plus, Trash2, X } from "lucide-react"
import { useState, type Dispatch, type SetStateAction } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet"
import { ViewTripDetails } from "./ViewTripDetails"
import { Link } from "react-router-dom"

interface TripsTableInterface {
	data: GetTripInterface[],
	agency_name: string
}

//export const columns: ColumnDef<GetTripInterface>[] = [
export const getColumns = (
	role: string,
	setSelectedTrip: Dispatch<SetStateAction<GetTripInterface | null>>,
	setOpen: Dispatch<SetStateAction<boolean>>,
	setUpdateFlag: Dispatch<SetStateAction<boolean>>,
	setDeleteFlag: Dispatch<SetStateAction<boolean>>,
): ColumnDef<GetTripInterface>[] => [
		{
			accessorKey: "srNo",
			header: "Sr. No.",
			cell: (info) => info.row.index + 1
		},
		{
			id: 'actions',
			header: 'Actions',
			cell: ({ row }) => {
				const trip = row.original;

				return (
					<div className="flex gap-2 justify-start">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="outline"
										className="cursor-pointer border p-2 hover:bg-gray-200"
										onClick={() => {
											setSelectedTrip(trip);
											setOpen(true);
										}}
									>
										<Eye />
									</Button>
								</TooltipTrigger>

								<TooltipContent>
									<p>View Trip</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						{
							role === "USER" && (
								<>
									{/*  check if user.role is USER and does not have booking for this trip */}
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													className="cursor-pointer border p-2 hover:bg-gray-200"
													variant="outline"
													id={trip.id}
												>
													<Plus />
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												<p>Book Trip</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>

									{/* check if user.role is USER and has booking for this trip */}
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													className="cursor-pointer border p-2 hover:bg-gray-200"
													variant="outline"
													id={trip.id}
												>
													<X />
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												<p>Cancel Booking</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</>
							)
						}

						{/* check if user.role is ADMIN  */}
						{
							role === "AGENCY_USER" && (
								<>
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													className="cursor-pointer border p-2 hover:bg-gray-200"
													variant="outline"
													onClick={() => {
														setSelectedTrip(trip);
														setUpdateFlag(true);
														setDeleteFlag(false);
														setOpen(true);
													}}
												>

													<Pencil />
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												<p>Edit Trip</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>

									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													className="cursor-pointer border p-2 hover:bg-gray-200"
													variant="outline"
													onClick={() => {
														setSelectedTrip(trip);
														setDeleteFlag(true);
														setUpdateFlag(false)
														setOpen(true);
													}}
												>
													<Trash2 />
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												<p>Delete Trip</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</>
							)}
					</div>
				)
			}
		},
		{
			accessorKey: "title",
			header: "Title"
		},
		{
			accessorKey: "destination",
			header: "Destination"
		},
		{
			accessorKey: "duration_days",
			header: "Duration Days"
		},
		{
			accessorKey: "duration_nights",
			header: "Duration Nights"
		},
		{
			accessorKey: "price",
			header: "Price",
			cell: ({ row }) => {
				const user = row.original
				return (
					<div className="">
						Rs. {user.price}/-
					</div>
				)
			}
		},
		{
			accessorKey: "discount_price",
			header: "Discount Price",
			cell: ({ row }) => {
				const user = row.original
				return (
					<div className="">
						Rs. {user.discount_price}/-
					</div>
				)
			}
		},
		{
			accessorKey: "is_active",
			header: "Status",
			cell: ({ row }) => {
				const user = row.original
				return (
					<Badge
						variant={user.is_active ? "outline" : "destructive"}
						className={user.is_active ? "border-green-300 bg-green-100 text-green-900" : "border-red-300 bg-red-100 text-red-900"}
					>
						{user.is_active ? ("Active") : ("Inactive")}
					</Badge>
				)
			}
		},
		{
			accessorKey: "actions",
			header: "Itinerary",
			cell: ({ row }) => {
				const trip = row.original
				return (
					<div className="">
						{/*{user.available_seats}*/}
						<Link
							to={`/itinerary/${trip.agency_id}/${trip.id}`}
							className="cursor-pointer hover:text-blue-700"
						>
							Create Itinerary
						</Link>
					</div>
				)
			}
		}
	]


export const TripsTable = ({ data, agency_name }: TripsTableInterface) => {

	const user = useSelector((state: RootState) => state.auth.user)

	const [selectedTrip, setSelectedTrip] = useState<GetTripInterface | null>(null);

	const [open, setOpen] = useState(false);
	const [updateFlag, setUpdateFlag] = useState(false);
	const [deleteFlag, setDeleteFlag] = useState(false);

	const columns = getColumns(user?.role ?? "", setSelectedTrip, setOpen, setUpdateFlag, setDeleteFlag);

	//const trips = data.data;

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

							<ViewTripDetails
								trip={selectedTrip}
								agency_name={agency_name}
								setUpdateFlag={setUpdateFlag}
								updateFlag={updateFlag}
								setDeleteFlag={setDeleteFlag}
								deleteFlag={deleteFlag}
								setOpen={setOpen}
							/>
						</SheetContent>
					</Sheet>
				</Table>
			</div>
		</div>
	)
}