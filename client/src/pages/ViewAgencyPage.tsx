import { Link, useParams } from "react-router-dom"
import { useGetAgency } from "../api/agency/agency-mutation"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../components/ui/breadcrumb"
import { AgencyUserData } from "../components/agency-page/AgencyUserData"

export const ViewAgencyPage = () => {

	const { agency_id } = useParams()

	const { data, isLoading, error } = useGetAgency({
		agency_id: agency_id
	})

	if (isLoading) {
		return (
			<div className="flex h-[70vh] items-center justify-center">
				Loading...
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-[70vh] items-center justify-center">
				Something went wrong.
			</div>
		);
	}

	return (
		<div className="py-5">

			<Breadcrumb className="px-40 py-5">
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
								All Agencies
							</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Agency</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<div className="w-300 mx-auto">
				<AgencyUserData data={data.data} />
			</div>
		</div>
	)
}