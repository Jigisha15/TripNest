import { CalendarDays } from "lucide-react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"

export const UpcomingTripsCard = () => {
	return (
		<div className="w-full flex flex-col items-center justify-center">
			<h1 className="text-3xl font-bold text-center mb-5">Upcoming Trips</h1>

			<div className="w-full flex flex-wrap items-center justify-center gap-5">
				{Array.from({ length: 3 }).map((_, index) => (
					<Card className="w-60 overflow-hidden py-0 rounded-xl bg-white shadow-md hover:shadow-lg">

						{/* Image Section */}
						<div className="relative h-44 w-full overflow-hidden">
							<img
								src="https://www.bandhavgarhnationalpark.in/uploads/madhya-pradesh-road-trip.jpg"
								alt="Trip destination"
								className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
							/>
							<Badge className="absolute top-3 left-3 rounded-full bg-white/50 px-2 py-2 text-sm font-medium text-green-800 shadow-md">
								<span className="w-1.5 h-1.5 border-green-800 rounded-full bg-green-800"></span> Upcoming
							</Badge>
						</div>

						{/* Content */}
						<CardContent className="space-y-2 py-0">

							<div>
								<h2 className="text-lg font-semibold text-gray-900">
									Trip Name
								</h2>

								<p className="text-sm text-gray-500">
									Agency Name
								</p>
							</div>

							<div className="flex items-center gap-2 text-sm text-gray-600">
								{/*<span>📅</span>*/}
								<CalendarDays size={18} />
								<span>12 Aug 2026 - 18 Aug 2026</span>
							</div>

							<Button className="mt-2 mb-5 w-full rounded-lg">
								Register
							</Button>

						</CardContent>
					</Card>
				))}
			</div>
		</div>
	)
}