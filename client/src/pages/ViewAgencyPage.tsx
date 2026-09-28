import { Link, useParams } from "react-router-dom"
import { useGetAgency } from "../api/agency/agency-mutation"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../components/ui/breadcrumb"
import { AgencyUserData } from "../components/agency-page/AgencyUserData"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Skeleton } from "../components/ui/skeleton"

export const ViewAgencyPage = () => {

	const { agency_id } = useParams()

	const { data, isLoading, error } = useGetAgency({
		agency_id: agency_id
	})

	if (isLoading) {
		return (
			<div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-5 px-4 py-10">
				<Card className="w-full overflow-hidden rounded-2xl py-0 shadow-lg">
					<CardHeader className="border-b bg-slate-50 py-4">
						<CardTitle>
							<Skeleton className="h-10 w-50" />
						</CardTitle>
					</CardHeader>

					{/* Actions */}
					<div className="flex items-center justify-end gap-4 px-5 py-2">
						{Array.from({ length: 3 }).map((_, index) => (
							<Skeleton key={index} className="h-8 w-20" />
						))}
					</div>

					<CardContent className="grid gap-10 p-8 md:grid-cols-[260px_1fr]">
						{/* Left Section */}
						<div className="flex flex-col items-center">
							<Skeleton className="h-48 w-48 rounded-full" />
							<Skeleton className="mt-5 h-8 w-50" />

							<div className="mt-5 w-full">
								<Skeleton className="mt-0 h-8 w-full" />
								<Skeleton className="mt-3 h-8 w-full" />
							</div>
						</div>

						{/* Right Section */}
						<div className="w-full">
							<div className="grid gap-6 md:grid-cols-2">
								{Array.from({ length: 6 }).map((_, index) => (
									<div key={index} className="space-y-2">
										<Skeleton className="h-8 w-40" />
										<Skeleton className="h-8 w-full" />
									</div>
								))}
							</div>

							<div className="mt-11 w-full flex items-center justify-between gap-5">
								<Skeleton className="mt-0 h-8 w-full" />
								<Skeleton className="mt-0 h-8 w-full" />
								<Skeleton className="mt-0 h-8 w-full" />
							</div>
						</div>
					</CardContent>
				</Card>
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

			<Breadcrumb className="px-5 md:px-40 py-5">
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

			{/*<div className="w-300 mx-auto">*/}
			<div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-5 px-4 py-10">
				<AgencyUserData data={data.data} />
			</div>
		</div>
	)
}