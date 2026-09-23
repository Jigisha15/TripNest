import { Link, useParams } from "react-router-dom"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { CreateBooking } from "../components/book-trip/CreateBooking"
import { useGetTrip } from "../api/trips/trips-mutation"
import { Badge } from "../components/ui/badge"
import { useState } from "react"
import { formatDate } from "../utils/formateDate"

export const BookTripPage = () => {

	const [check, setCheck] = useState<boolean>(false)
	const { agency_id, agency_name, trip_id, user_id } = useParams()

	const { data, isLoading, error } = useGetTrip({
		trip_id: trip_id
	})

	if (isLoading) {
		return (
			<div className="flex items-center justify-center my-5">
				<Card className="w-100 text-center py-2">
					Loading...
				</Card>
			</div>
		)
	}

	if (error) {
		return (
			<div className="flex items-center justify-center my-5">
				<Card className="w-100 text-center py-2">
					Error while loading
				</Card>
			</div>
		)
	}

	const tripData = data.data[0]
	console.log(tripData)

	const deadlineDate = formatDate(tripData.booking_deadline)

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
								<Link to={`/trips/${agency_id}/${agency_name}`} className="cursor-pointer">
									Trips
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Book trip</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>

			<div className="flex items-center justify-center my-5">
				<Card className="w-150">
					<CardHeader>
						<CardTitle>Book Trip</CardTitle>
						<CardDescription className="flex items-center justify-between">
							<h1 className="">{tripData.title}</h1>

							<Badge
								className={`px-2 py-1 ${tripData.is_active ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}`}
							>
								{tripData.is_active ? "Active" : "Inactive"}
							</Badge>
						</CardDescription>
					</CardHeader>

					<CardContent className="flex flex-col gap-2">

						<div className="inline-flex gap-2 text-base">
							<h1>Total Amount : </h1>
							<p>Rs. {tripData.price}</p>
						</div>

						<CreateBooking
							trip_id={trip_id!}
							user_id={user_id!}
							check={check}
							deadline_date={deadlineDate}
							setCheck={setCheck}
							total_amount={Number(tripData.price)}
						/>

					</CardContent>


					<CardFooter className="justify-center">
						A trip by - {agency_name}
					</CardFooter>
				</Card>
			</div>
		</div >
	)
}
