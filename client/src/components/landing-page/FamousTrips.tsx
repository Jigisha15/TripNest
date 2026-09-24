import { CalendarDays, Save } from "lucide-react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { formatDate } from "../../utils/formateDate"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../../app/store"

interface FamousTripsInterface {
	data: any
}

export const FamousTrips = ({ data }: FamousTripsInterface) => {

	const user = useSelector((state: RootState) => state.auth.user);
	const navigate = useNavigate()

	return (
		<div className="w-full flex flex-col items-center justify-center">
			<h1 className="text-3xl font-bold text-center my-5">Popular Trips</h1>


			{data.map((trip: any, index: any) => {
				const start_date = formatDate(trip.start_date)
				const end_date = formatDate(trip.end_date)
				return (
					<Card key={index} className="w-75 overflow-hidden py-0 rounded-xl bg-white shadow-md hover:shadow-lg">

						{/* Image Section */}
						<div className="relative h-54 w-full overflow-hidden">
							<img
								src="https://www.bandhavgarhnationalpark.in/uploads/madhya-pradesh-road-trip.jpg"
								alt="Trip destination"
								className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
							/>
							<Badge className="absolute top-3 left-3 rounded-full bg-white/50 px-2 py-2 text-sm font-medium text-green-800 shadow-md">
								<span className="w-1.5 h-1.5 border-green-800 rounded-full bg-green-800"></span> Popular
							</Badge>
						</div>

						{/* Content */}
						<CardContent className="space-y-2 py-0">

							<div>
								<h2 className="text-lg font-semibold text-gray-900">
									{trip.trip_title}
								</h2>

								<p className="text-sm text-gray-500">
									{trip.agency_name}
								</p>
							</div>

							<div className="flex items-center gap-2 text-sm text-gray-600">
								{/*<span>📅</span>*/}
								<CalendarDays size={18} />
								<span>{start_date} - {end_date}</span>
							</div>

							<Button
								onClick={() => { navigate(`/book-trip/${trip.agency_id}/${trip.agency_name}/${trip.trip_id}/${user?.id}`) }}
								className="mt-2 mb-5 w-full rounded-lg"
							>
								<Save />Book
							</Button>

						</CardContent >
					</Card >
				)
			})}
		</div>
	)
}