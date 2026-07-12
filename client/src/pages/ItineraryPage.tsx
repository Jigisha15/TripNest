import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom"
import { useGetItinerary } from "../api/itinerary/itinerary-mutation";
import { Card } from "../components/ui/card";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";
import { useState, type SetStateAction } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../components/ui/breadcrumb";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/ui/sheet";
import { CreateItinerary } from "../components/itinerary/CreateItinerary";
import { ItineraryTable } from "../components/itinerary/ItineraryTable";
import { ViewItinerary } from "../components/itinerary/ViewItinerary";

export const ItineraryPage = () => {

	const user = useSelector((state: RootState) => state.auth.user);

	const [openCreate, setOpenCreate] = useState<boolean>(false)

	const { agency_id, trip_id } = useParams()

	if (!agency_id || !trip_id) {

		toast.error("Missing parameter - agency_id or trip_id")

		return (
			<div className="flex h-[70vh] items-center justify-center">
				Something went wrong.
			</div>
		);
	}

	const { data, isLoading, error } = useGetItinerary({
		trip_id: trip_id
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

	const itinerary = data?.data

	//if (!data?.data?.length) {
	if (!itinerary?.length) {
		return (
			<div className="w-full h-100 flex items-center justify-center px-5">
				<Card className="w-120 px-5">
					<h1 className="text-center">Not planned any itinerary yet</h1>
					{user?.role === "AGENCY_USER" ? (
						<div className="flex items-center justify-center w-full">
							<Button
								className="cursor-pointer"
								variant="outline"
								onClick={() => {
									setOpenCreate(true)
								}}
							>
								<Plus />Plan an Itinerary
							</Button>
						</div>
					) : (
						<div className="">No itineraries made yet. We'll keep you updated.</div>
					)}
				</Card>

				{/*CREATE TRIP SHEET*/}
				<Sheet open={openCreate} onOpenChange={setOpenCreate}>
					<SheetContent className="w-full! sm:max-w-xl! lg:max-w-2xl! overflow-y-auto">
						<SheetHeader>
							<SheetTitle>Create trip</SheetTitle>
						</SheetHeader>

						<CreateItinerary
							agency_id={agency_id}
							trip_id={trip_id}
							openCreate={openCreate}
							setOpenCreate={setOpenCreate}
						/>
						{/*<CreateTrip
						agency_id={agency_id}
						setOpenCreate={setOpenCreate}
					/>*/}
					</SheetContent>
				</Sheet >
			</div >
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
							<BreadcrumbLink asChild>
								<Link to={`/trips/${agency_id}/${trip_id}`}
									className="cursor-pointer">
									Trips
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Itinerary</BreadcrumbPage>
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
				{/*<ItineraryTable
					data={itinerary}
					agency_id={agency_id}
					trip_id={trip_id}
					user={user} />*/}
				<ViewItinerary
					data={itinerary}
					agency_id={agency_id}
					trip_id={trip_id}
					user={user}
				/>
				{/**
				 * if role === "AGENCY_USER
				 * give ability to create ,update,delete
				 * if role === "USER"
				 * give ability to view, book, cancel if booked
			 */}
				{/*<TripsTable data={data.data} agency_name={agency_name} />*/}
			</div>

			{/*CREATE TRIP SHEET
			<Sheet open={openCreate} onOpenChange={setOpenCreate}>
				<SheetContent className="w-full! sm:max-w-xl! lg:max-w-2xl! overflow-y-auto">
					<SheetHeader>
						<SheetTitle>Create trip</SheetTitle>
					</SheetHeader>

					<CreateItinerary openCreate={openCreate} />
					{/*<CreateTrip
						agency_id={agency_id}
						setOpenCreate={setOpenCreate}
					/>*
		</SheetContent>
			</Sheet >*/}
		</div >
	)
}