import { Link, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { TripsTable } from "../components/trips/TripsTable"
import { useGetTrip } from "../api/trips/trips-mutation"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../components/ui/breadcrumb"
import { Card } from "../components/ui/card"
import { useSelector } from "react-redux"
import type { RootState } from "../app/store"
import { Button } from "../components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/ui/sheet"
import { CreateTrip } from "../components/trips/CreateTrip"

export const TripsPage = () => {

	const user = useSelector((state: RootState) => state.auth.user);

	const [openCreate, setOpenCreate] = useState<boolean>(false)

	const { agency_id, agency_name } = useParams()

	if (!agency_id || !agency_name) {

		toast.error("Missing parameter - agency_id or agency_name")

		return (
			<div className="flex h-[70vh] items-center justify-center">
				Something went wrong.
			</div>
		);
	}

	const { data, isLoading, error } = useGetTrip({
		agency_id: agency_id
	})

	if (isLoading) {
		return (
			<div className="flex h-[70vh] items-center justify-center">
				Loading...
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-[70vh] items-center justify-center">
				Something went wrong.
			</div>
		);
	}

	if (!data?.data?.length) {
		return (
			<div className="w-full h-100 flex items-center justify-center px-5">
				<Card className="w-120 px-5">
					<h1 className="text-center">{agency_name} has not planned any trips yet</h1>
					{user?.role === "AGENCY_USER" ? (
						<div className="flex items-center justify-center w-full">
							<Button
								className="cursor-pointer"
								variant="outline"
								onClick={() => {
									setOpenCreate(true)
								}}
							>
								<Plus />Plan a Trip
							</Button>
						</div>
					) : (
						<div className="">Get back when {agency_name} plans any trip. We'll keep you updated</div>
					)}
				</Card>

				{/*CREATE TRIP SHEET
				<Sheet open={openCreate} onOpenChange={setOpenCreate}>
					<SheetContent className="w-full! sm:max-w-xl! lg:max-w-2xl! overflow-y-auto">
						<SheetHeader>
							<SheetTitle>Create trip</SheetTitle>
						</SheetHeader>

						<CreateTrip
							agency_id={agency_id}
							setOpenCreate={setOpenCreate}
						/>
					</SheetContent>
				</Sheet>*/}
			</div>
		)
	}

	return (
		<div className="mt-5">

			<div className="flex items-center justify-between">
				<Breadcrumb className="md:mx-40">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link to="/" className="cursor-pointer">
									Home
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link to="/agency" className="cursor-pointer">
									Agencies
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Trips</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>


				<Button
					className="mr-35 cursor-pointer"
					variant="outline"
					onClick={() => {
						setOpenCreate(true)
					}}
				>
					<Plus />Create Trip
				</Button>
			</div>

			<div className="mx-auto max-w-6xl px-4 py-10 flex items-center justify-center gap-5 flex-col">
				{/**
				 * if role === "AGENCY_USER
				 * give ability to create ,update,delete
				 * if role === "USER"
				 * give ability to view, book, cancel if booked
			 */}
				<TripsTable data={data.data} agency_name={agency_name} />
			</div>

			{/* CREATE TRIP SHEET */}
			<Sheet open={openCreate} onOpenChange={setOpenCreate}>
				<SheetContent className="w-full! sm:max-w-xl! lg:max-w-2xl! overflow-y-auto">
					<SheetHeader>
						<SheetTitle>Create trip</SheetTitle>
					</SheetHeader>

					<CreateTrip
						agency_id={agency_id}
						setOpenCreate={setOpenCreate}
					/>
				</SheetContent>
			</Sheet>
		</div>
	)
}