import type { GetBookingInterface } from "../../interfaces/booking.interface"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

interface GetBookingDataInterface {
	data: GetBookingInterface
}

export const BookingData = ({ data }: GetBookingDataInterface) => {
	return (
		<>
			{data ? (
				<div className=""></div>
			) : (
				<Card className="overflow-hidden rounded-2xl shadow-lg w-full">
					<CardHeader className="border-b bg-slate-50 py-0">
						<CardTitle className="text-2xl font-bold">
							My Bookings
						</CardTitle>
					</CardHeader>
					<CardContent className="py-4 text-center">
						No Bookings available
					</CardContent>
				</Card>
			)}
		</>
	)
}