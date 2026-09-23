import { Link, useParams } from "react-router-dom"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../components/ui/breadcrumb"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { CreateBooking } from "../components/book-trip/CreateBooking"

export const BookTripPage = () => {

	const { agency_id, agency_name, trip_id, user_id } = useParams()

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
				<Card className="w-100">
					<CardHeader>
						<CardTitle>Book Tripsss</CardTitle>
						<CardDescription>
							<h1 className="">Trip Name</h1>
							<h1 className="">{agency_name}</h1>
						</CardDescription>
					</CardHeader>
					<CardContent>
						<CreateBooking
							trip_id={trip_id!}
							user_id={user_id!}
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
