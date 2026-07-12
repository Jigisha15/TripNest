import { useGetAgency } from "../../api/agency/agency-mutation";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import type { GetAgencyInterface } from "../../interfaces/agency.interface";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { ArrowUpRight, Eye, Pencil, Trash2, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import type { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { useState, type Dispatch, type SetStateAction } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { ViewAgencyDetails } from "./ViewAgencyDetails";
import { ViewAgencyUserDetails } from "./ViewAgencyUserDetails";

export const getColumns = (
	role: string,
	setSelectedAgency: Dispatch<SetStateAction<GetAgencyInterface | null>>,
	setOpen: Dispatch<SetStateAction<boolean>>,
	setUpdateFlag: Dispatch<SetStateAction<boolean>>,
	setDeleteFlag: Dispatch<SetStateAction<boolean>>,
	setOpenUser: Dispatch<SetStateAction<boolean>>,
	setAgencyUser: Dispatch<SetStateAction<string>>,
): ColumnDef<GetAgencyInterface>[] => [
		{
			id: 'srNo',
			header: 'Sr. No.',
			cell: (info) => info.row.index + 1,
		},
		{
			id: 'actions',
			header: 'Actions',
			cell: ({ row }) => {
				const agency = row.original;

				return (
					<div className="flex gap-2 justify-start">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="outline"
										className="cursor-pointer border p-2 hover:bg-gray-200"
										onClick={() => {
											setSelectedAgency(agency);
											setOpen(true);
										}}
									>
										<Eye />
									</Button>
								</TooltipTrigger>

								<TooltipContent>
									<p>View Agency</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						{
							role === "ADMIN" && (
								<>
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													className="cursor-pointer border p-2 hover:bg-gray-200"
													variant="outline"
													onClick={() => {
														setSelectedAgency(agency);
														setUpdateFlag(true);
														setDeleteFlag(false)
														setOpen(true);
													}}
												>
													<Pencil />
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												<p>Edit Agency</p>
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
														setSelectedAgency(agency);
														setDeleteFlag(true);
														setUpdateFlag(false)
														setOpen(true);
													}}
												>
													<Trash2 />
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												<p>Delete Agency</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</>
							)
						}

						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										className="cursor-pointer border p-2 hover:bg-gray-200"
										variant="outline"
										onClick={() => {
											setAgencyUser(agency.owner_id);
											setOpenUser(true);
										}}
									>
										<User />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>View Agency Admin</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				);
			}
		},
		{
			accessorKey: "name",
			header: "Agency Name",
			cell: ({ row }) => {
				const user = row.original

				return (
					<div className="">
						{user.website ? (
							<Link
								to={user.website}
								target="_blank"
								className="group mt-2 flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700">
								{user.name}
								<ArrowUpRight
									size={15}
									className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
								/>
							</Link>
						) : (
							<div className="">{user.name}</div>
						)}
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
			accessorKey: "email_id",
			header: "Email",
		},
		{
			accessorKey: "phone_number",
			header: "Phone",
		},
		{
			accessorKey: "city",
			header: "Location",
			cell: ({ row }) => {
				const user = row.original
				return (
					<div className="">{user.city}, {user.country}</div>
				)
			}
		},
		{
			accessorKey: "action",
			header: "View Trips",
			cell: ({ row }) => {
				const user = row.original
				return (
					<Link to={`/trips/${user.id}/${user.name}`} className="text-blue-600">Check Trips</Link>
				)
			}
		}
	];

export const AgencyTable = () => {

	const user = useSelector((state: RootState) => state.auth.user);

	const [selectedAgency, setSelectedAgency] = useState<GetAgencyInterface | null>(null);
	const [open, setOpen] = useState<boolean>(false);

	const [openUser, setOpenUser] = useState<boolean>(false);
	const [agencyUser, setAgencyUser] = useState<string>("");

	const [updateFlag, setUpdateFlag] = useState<boolean>(false)
	const [deleteFlag, setDeleteFlag] = useState<boolean>(false)

	const { data, isLoading, error } = useGetAgency();

	if (isLoading) {
		return (
			<div className="flex h-[70vh] items-center justify-center">
				Loading...
			</div>
		);
	}

	if (error || !data?.data?.length) {
		return (
			<div className="flex h-[70vh] items-center justify-center">
				Something went wrong.
			</div>
		);
	}

	const agency = data.data;

	const columns = getColumns(user?.role ?? "", setSelectedAgency, setOpen, setUpdateFlag, setDeleteFlag, setOpenUser, setAgencyUser);

	const table = useReactTable({
		data: agency,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="w-full">
			<div className="overflow-hidden rounded-md">
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

					{/*  CRUD FOR AGENCY */}
					<Sheet open={open} onOpenChange={setOpen}>
						<SheetContent className="w-full! sm:max-w-xl! lg:max-w-2xl! overflow-y-auto">
							<SheetHeader>
								<SheetTitle>Agency Details</SheetTitle>
							</SheetHeader>

							<ViewAgencyDetails
								agency={selectedAgency}
								setUpdateFlag={setUpdateFlag}
								updateFlag={updateFlag}
								setDeleteFlag={setDeleteFlag}
								deleteFlag={deleteFlag}
								setOpen={setOpen}
							/>
						</SheetContent>
					</Sheet>

					{/*  VIEW THE USER */}
					<Sheet open={openUser} onOpenChange={setOpenUser}>
						<SheetContent className="w-full! sm:max-w-xl! lg:max-w-2xl! overflow-y-auto">
							<SheetHeader>
								<SheetTitle>Agency User Details</SheetTitle>
							</SheetHeader>

							<ViewAgencyUserDetails owner_id={agencyUser} />
						</SheetContent>
					</Sheet>
				</Table>
			</div>
		</div >
	)
}