import { Link, useParams } from "react-router-dom"
import { useGetBooking } from "../api/booking/booking-mutation"
import { Card } from "../components/ui/card"
import { BookingTable } from "../components/book-trip/BookingTable"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../components/ui/breadcrumb"

export const BookingsPage = () => {

	const { user_id } = useParams()

	// get bookings api
	const { data, isLoading, error } = useGetBooking({
		user_id: user_id
	})

	if (isLoading) {
		return (
			<div className="flex h-[70vh] items-center justify-center">
				<Card className="px-4 py-2">
					Loading...
				</Card>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-[70vh] items-center justify-center">
				<Card className="px-4 py-2">
					Something went wrong.
				</Card>
			</div>
		);
	}


	if (!data.data.length) {
		return (
			<div className="flex h-[70vh] items-center justify-center">
				<Card className="px-4 py-2">
					No data present.
				</Card>
			</div>
		)
	}

	const bookingData = data.data

	return (
		<div className="my-5 mx-auto w-[75%]">

			<Breadcrumb className="">
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
						<BreadcrumbPage>Bookings</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<h1 className="text-center mb-5">All Bookings</h1>

			<BookingTable
				bookingData={bookingData}
				user_id={user_id!}
			/>
		</div>
	)
}