import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom"
import { useGetItinerary } from "../api/itinerary/itinerary-mutation";
import { Card } from "../components/ui/card";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { Button } from "../components/ui/button";
import { Plus, SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../components/ui/breadcrumb";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/ui/sheet";
import { CreateItinerary } from "../components/itinerary/CreateItinerary";
import { ViewItinerary } from "../components/itinerary/ViewItinerary";
import { useGetTrip } from "../api/trips/trips-mutation";
import type { ItineraryValidation } from "../interfaces/itinerary.interface";

export const ItineraryPage = () => {
	const user = useSelector((state: RootState) => state.auth.user);

	const [openCreate, setOpenCreate] = useState<boolean>(false);
	const [openEdit, setOpenEdit] = useState<boolean>(false);
	const [selectedItinerary, setSelectedItinerary] = useState<ItineraryValidation[] | null>(null);

	const { agency_id, agency_name, trip_id } = useParams();

	// Hooks must run unconditionally, every render — even if params are missing.
	// react-query hooks handle `undefined` fine via `enabled` (see note below).
	const { data, isLoading, error } = useGetItinerary({
		trip_id: trip_id as string,
	});

	const { data: tripData, isLoading: tripLoading, error: tripError } = useGetTrip({
		trip_id: trip_id as string,
	});

	// Side effects (like toasts) belong in an effect, not directly in the render body.
	useEffect(() => {
		if (!agency_id || !agency_name || !trip_id) {
			toast.error("Missing parameter - agency_id, agency_name or trip_id");
		}
	}, [agency_id, agency_name, trip_id]);

	if (!agency_id || !agency_name || !trip_id) {
		return (
			<div className="flex h-[70vh] items-center justify-center">
				Something went wrong.
			</div>
		);
	}

	if (isLoading || tripLoading) {
		return (
			<div className="flex h-[70vh] items-center justify-center">
				Loading...
			</div>
		);
	}

	if (error || tripError) {
		return (
			<div className="flex h-[70vh] items-center justify-center">
				Something went wrong.
			</div>
		);
	}

	const itinerary = data?.data;
	const trip = tripData?.data?.[0];

	const numberOfDays = trip?.duration_days || 0;
	const numberOfNights = trip?.duration_nights || 0;

	// Call this wherever you trigger "edit" (e.g. a row's Edit button in ViewItinerary,
	// or the header "Update Trip" button once an itinerary already exists)
	const handleEditClick = (itineraries: ItineraryValidation[]) => {
		setSelectedItinerary(itineraries);
		setOpenEdit(true);
	};

	// Shared sheets — rendered once, used by both the empty-state and main views
	const itinerarySheets = (
		<>
			{/* CREATE TRIP SHEET */}
			<Sheet open={openCreate} onOpenChange={setOpenCreate}>
				<SheetContent className="w-full! sm:max-w-xl! lg:max-w-2xl! overflow-y-auto">
					<SheetHeader>
						<SheetTitle>Create trip</SheetTitle>
					</SheetHeader>
					<CreateItinerary
						agency_id={agency_id}
						agency_name={agency_name}
						trip_id={trip_id}
						openCreate={openCreate}
						setOpenCreate={setOpenCreate}
						numberOfDays={numberOfDays}
						numberOfNights={numberOfNights}
					/>
				</SheetContent>
			</Sheet>

			{/* EDIT TRIP SHEET */}
			<Sheet open={openEdit} onOpenChange={setOpenEdit}>
				<SheetContent className="w-full! sm:max-w-xl! lg:max-w-2xl! overflow-y-auto">
					<SheetHeader>
						<SheetTitle>Edit trip</SheetTitle>
					</SheetHeader>
					{selectedItinerary && (
						<CreateItinerary
							agency_id={agency_id}
							agency_name={agency_name}
							trip_id={trip_id}
							openCreate={openEdit}
							setOpenCreate={setOpenEdit}
							numberOfDays={numberOfDays}
							numberOfNights={numberOfNights}
							isUpdate
							existingItinerary={selectedItinerary}
						/>
					)}
				</SheetContent>
			</Sheet>
		</>
	);

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
								onClick={() => setOpenCreate(true)}
							>
								<Plus />Plan an Itinerary
							</Button>
						</div>
					) : (
						<div className="text-center">No itineraries made yet. We'll keep you updated.</div>
					)}
				</Card>

				{itinerarySheets}
			</div>
		);
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

				{/* We only reach this branch once `itinerary` is non-empty, so this is
				    always an "update" — the create case is handled by the empty-state return above. */}
				<Button
					className="mr-35 cursor-pointer"
					variant="outline"
					onClick={() => handleEditClick(itinerary)}
				>
					<SquarePen />Update Trip
				</Button>
			</div>

			<div className="mx-auto max-w-6xl px-4 py-10 flex items-center justify-center gap-5 flex-col">
				<ViewItinerary
					data={itinerary}
					trip={trip}
					agency_id={agency_id}
					agency_name={agency_name}
					user={user}
				//onEdit={handleEditClick}
				/>
			</div>

			{itinerarySheets}
		</div>
	);
};