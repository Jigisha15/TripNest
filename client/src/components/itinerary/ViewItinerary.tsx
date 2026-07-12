import type { GetItineraryInterface } from "../../interfaces/itinerary.interface"
import { Badge } from "../ui/badge"
import { Card, CardContent } from "../ui/card"
import { Separator } from "../ui/separator";

interface ViewItineraryPageInterface {
	data: GetItineraryInterface[],
	agency_id: string,
	trip_id: string,
	user: any,
}

export const ViewItinerary = ({ data, agency_id, trip_id, user }: ViewItineraryPageInterface) => {
	return (
		<div className="mx-auto w-full bg-white p-8">

			{/* ================= HEADER ================= */}
			<div className="rounded-lg w-full border border-slate-200 bg-linear-to-r from-blue-50 to-sky-50 p-8 text-center shadow-sm">

				<h2 className="text-sm font-semibold uppercase tracking-[0.3rem] text-slate-500">
					Dream Escape Travels
				</h2>

				<h1 className="mt-3 text-4xl font-bold text-slate-800">
					GOA TOUR PACKAGE
				</h1>

				<p className="mt-2 text-slate-600">
					5 Days • 4 Nights
				</p>

			</div>

			{/* ================= TRIP DETAILS ================= */}

			<Card className="mt-8 border-slate-200 shadow-sm">

				<CardContent className="p-6">

					<h3 className="mb-5 text-xl font-semibold">
						Trip Details
					</h3>

					<div className="grid grid-cols-2 gap-y-5 gap-x-12 text-sm">

						<div>
							<p className="font-medium text-slate-500">
								Destination
							</p>

							<p className="mt-1 text-base font-semibold">
								Goa
							</p>
						</div>

						<div>
							<p className="font-medium text-slate-500">
								Duration
							</p>

							<p className="mt-1 text-base font-semibold">
								5 Days / 4 Nights
							</p>
						</div>

						<div>
							<p className="font-medium text-slate-500">
								Meeting Point
							</p>

							<p className="mt-1 text-base font-semibold">
								Mumbai Airport
							</p>
						</div>

						<div>
							<p className="font-medium text-slate-500">
								Transport
							</p>

							<p className="mt-1 text-base font-semibold">
								Flight
							</p>
						</div>

						<div>
							<p className="font-medium text-slate-500">
								Meals
							</p>

							<p className="mt-1 text-base font-semibold">
								Breakfast & Dinner
							</p>
						</div>

						<div>
							<p className="font-medium text-slate-500">
								Accommodation
							</p>

							<p className="mt-1 text-base font-semibold">
								3★ Deluxe Hotel
							</p>
						</div>

					</div>

				</CardContent>

			</Card>

			{/* ================= ITINERARY ================= */}

			<div className="mt-10 space-y-8">

				{data.map((day) => (
					<div key={day.id}>

						<div className="flex items-center gap-4">

							<div className="h-px flex-1 bg-slate-300" />

							<Badge
								className="rounded-full px-4 py-1 text-sm"
							>
								DAY {day.day_number}
							</Badge>

							<div className="h-px flex-1 bg-slate-300" />

						</div>

						<div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-6">

							<h3 className="text-2xl font-bold text-slate-800">
								{day.title}
							</h3>

							<p className="mt-4 whitespace-pre-wrap leading-8 text-slate-600">
								{day.description}
							</p>

						</div>

					</div>
				))}

			</div>

			{/* ================= NOTES ================= */}

			<Card className="mt-12 border-amber-200 bg-amber-50">

				<CardContent className="p-6">

					<h3 className="text-lg font-bold text-amber-900">
						Important Instructions
					</h3>

					<ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-amber-900">

						<li>Carry a valid Government ID proof.</li>

						<li>Report at least 30 minutes before departure.</li>

						<li>Keep your belongings safe.</li>

						<li>Follow the tour guide's instructions.</li>

						<li>Maintain cleanliness throughout the journey.</li>

					</ul>

				</CardContent>

			</Card>

			{/* ================= FOOTER ================= */}

			<div className="mt-14 text-center">

				<Separator />

				<h3 className="mt-8 text-2xl font-semibold text-slate-800">
					Thank You!
				</h3>

				<p className="mt-2 text-slate-500">
					We wish you a safe and memorable journey.
				</p>

				<p className="mt-6 text-sm tracking-widest text-slate-400 uppercase">
					Dream Escape Travels
				</p>

			</div>

		</div>
	);
}