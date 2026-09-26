import type { GetItineraryInterface } from "../../interfaces/itinerary.interface"
import type { GetTripInterface } from "../../interfaces/trips.interface";
import { formatDate } from "../../utils/formateDate";
import { TripDetailCard } from "./reusables/TripDetailCard";
import { ItinerarySection } from "./reusables/ItinerarySection";
import { ItineraryHeader } from "./reusables/ItineraryHeader";
import { ItineraryFooter } from "./reusables/ItineraryFooter";
import { useState } from "react";
interface ViewItineraryPageInterface {
	data: GetItineraryInterface[],
	trip: GetTripInterface,
	//agency_id: string,
	agency_name: string,
	//user: any,
}

export const ViewItinerary = ({ data, trip, agency_name }: ViewItineraryPageInterface) => {

	const [isUpdate, setIsUpdate] = useState<boolean>(false)

	const date = formatDate(trip.booking_deadline);

	const tripDetails = [
		{
			title: "Destination",
			value: trip.destination,
		},
		{
			title: "Duration",
			value: `${trip.duration_days} Days / ${trip.duration_nights} Nights`,
		},
		{
			title: "Is Active",
			value: trip.is_active ? "Active" : "Inactive",
		},
		{
			title: "Booking Deadline",
			value: date,
		},
	];

	return (
		<div className="mx-auto w-full bg-white p-8" id="itinerary-pdf">
			{/* Header */}
			<ItineraryHeader
				agency_name={agency_name}
				title={trip.title}
				description={trip.description}
				short_description={trip.short_description}
			/>

			{/* Trip Details */}
			< div className="mt-5 flex items-center justify-center gap-5" >
				{
					tripDetails.map((detail) => (
						<TripDetailCard
							key={detail.title}
							title={detail.title}
							value={detail.value}
						/>
					))
				}
			</div >

			{/* Main Itinerary - write the update thing here */}
			<div className="pdf-container mt-10 space-y-8">
				{data.map((section, index) => (
					<ItinerarySection
						key={section.id}
						section={section}
						isLast={index === data.length - 1}
						isUpdate={isUpdate}
						setIsUpdate={setIsUpdate}
					/>
				))}
			</div>

			{/* Footer */}
			<ItineraryFooter agency_name={agency_name} />
		</div>
	);
};