import { useDeleteItinerary, useGetItinerary } from "../api/itinerary/itinerary-mutation";
import { Card } from "../components/ui/card"
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Download, Plus, SquarePen, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/alert-dialog";
import { Spinner } from "../components/ui/spinner";
import toast from "react-hot-toast";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../components/ui/breadcrumb";
import { useState } from "react";
import { ViewItinerary } from "../components/itinerary/ViewItinerary";
import { useGetTrip } from "../api/trips/trips-mutation";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/ui/sheet";
import { CreateItinerary } from "../components/itinerary/CreateItinerary";
import { exportPDF } from "../lib/exportToPdf";

export const ItineraryPage = () => {

	// -------- STATEs --------
	// update state - selectedItinerary
	const [openCreate, setOpenCreate] = useState<boolean>(false)
	const [openUpdate, setOpenUpdate] = useState<boolean>(false)
	//const [selectedItineray, setSelectedItinerary] = useState<UpdateItineraryInterface>()

	const user = useSelector((state: RootState) => state.auth.user);

	const { agency_id, agency_name, trip_id, trip_name } = useParams();

	// -------- APIs --------
	// get api - itinerary
	const { data: itineraryData, isLoading: itineraryLoading, error: itineraryError } = useGetItinerary({
		trip_id: trip_id as string,
	});

	// get api - trip
	const { data: tripData, isLoading: tripLoading, error: tripError } = useGetTrip({
		trip_id: trip_id as string
	})

	// delete api
	const { mutateAsync: deleteItineraryMutation, isPending: isPendingD } = useDeleteItinerary()

	// delete itinerary logic function
	const handleDeleteItinerary = async () => {
		try {
			if (!trip_id) {
				toast.error("Trip id not selected")
				return
			}

			await deleteItineraryMutation(trip_id)
			//resetForm()
			toast.success("Itinerary deleted successfully")

		} catch (error: any) {
			console.error("Error while deleting itinerary : ", error)
			toast.error("Error while deleting itinerary : ", error)
		}
	}


	// if data is being loaded
	if (tripLoading || itineraryLoading) {
		return (
			<div className="w-full h-100 flex items-center justify-center px-5">
				<Card className="px-5">
					Loading....
				</Card>
			</div>
		)
	}

	// if there are any errors while fetching the data
	if (tripError || itineraryError) {
		return (
			<div className="w-full h-100 flex items-center justify-center px-5">
				<Card className="px-5">
					Error while fetching data
				</Card>
			</div>
		)
	}

	// if data is not there - show create component - differentiate it with respect to the role
	if (!itineraryData.data.length) {
		return (
			<div className="w-full h-100 flex items-center justify-center px-5">
				{user?.role === "AGENCY_USER" ? (
					<>
						<Card className="px-5">
							<h1>Itinerary is not created for this trip.</h1>
							<Button
								variant="default"
								onClick={() => setOpenCreate(true)}
							>
								<Plus /> Create Itinerary
							</Button>
						</Card>

						<Sheet open={openCreate} onOpenChange={setOpenCreate}>
							<SheetContent className="w-full! sm:max-w-xl! lg:max-w-2xl! overflow-y-auto">
								<SheetHeader>
									<SheetTitle>Create Iitnerary</SheetTitle>
								</SheetHeader>
								<CreateItinerary
									trip_id={tripData.data[0].id}
									setOpenCreate={setOpenCreate}
									duration_days={tripData.data[0].duration_days}
									duration_nights={tripData.data[0].duration_nights}
									mode="CREATE"
								/>
							</SheetContent>
						</Sheet>
					</>
				) : (
					<Card className="px-5">
						<h1>Itinerary is not created for this trip. Please recheck after sometime.</h1>
					</Card >
				)}
			</div >
		)
	}

	// if data is there - show the fetched data, show update button, show delete button
	return (
		<div className="w-full flex flex-col gap-5 items-center p-5">

			<div className="flex justify-between w-[80%]">

				<Breadcrumb className="">
					{/*<Breadcrumb className="md:mx-40">*/}
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
								<Link to={`/trips/${agency_id}/${trip_id}`} className="cursor-pointer">
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

				{user?.role === "AGENCY_USER" && (
					<div className="flex gap-3">

						<Button onClick={() => {
							exportPDF()
						}}>
							<Download /> Download
						</Button>

						<Button onClick={() => setOpenUpdate(true)}><SquarePen /> Update</Button>
						<Sheet open={openUpdate} onOpenChange={setOpenUpdate}>
							<SheetContent className="w-full! sm:max-w-xl! lg:max-w-2xl! overflow-y-auto">
								<SheetHeader>
									<SheetTitle>Update Itinerary</SheetTitle>
								</SheetHeader>
								<CreateItinerary
									trip_id={tripData.data[0].id}
									setOpenUpdate={setOpenUpdate}
									duration_days={tripData.data[0].duration_days}
									duration_nights={tripData.data[0].duration_nights}
									mode="UPDATE"
									initialData={itineraryData.data}
								/>
							</SheetContent>
						</Sheet>

						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant="destructive"
									className="cursor-pointer hover:no-underline"
								>
									<Trash2 />Delete Itinerary
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										Are you sure?
									</AlertDialogTitle>

									<AlertDialogDescription>
										Itinerary for {trip_name} and all the details related to it will be deleted permanently.
									</AlertDialogDescription>
								</AlertDialogHeader>

								<AlertDialogFooter>
									<AlertDialogCancel
										variant={undefined}
										size={undefined}
										className="cursor-pointer"
									>
										Cancel
									</AlertDialogCancel>

									<AlertDialogAction
										onClick={handleDeleteItinerary}
										variant="destructive"
										size={undefined}
										className="cursor-pointer"
									>
										{
											isPendingD ? (
												<><Spinner />Deleting...</>
											) : (
												<><Trash2 /> Delete</>
											)
										}
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				)}
			</div>

			<Card className="px-5">
				<ViewItinerary
					data={itineraryData.data}
					trip={tripData.data[0]}
					agency_id={agency_id!}
					agency_name={agency_name!}
					user={user}
				/>
			</Card>

		</div>
	)
}