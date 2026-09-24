import type { GetAgencyInterface } from "../../interfaces/agency.interface"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { ArrowRight, Mail, Phone } from "lucide-react"
import { Badge } from "../ui/badge"
import { useNavigate } from "react-router-dom"


interface AgencyCardInterface {
	data: GetAgencyInterface
}

export const AgencyCard = ({ data }: AgencyCardInterface) => {

	const navigate = useNavigate()

	return (
		<Card
			className="w-full max-w-sm gap-2 pt-2 px-2 overflow-hidden border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
		>
			<CardHeader className="p-0">
				{/* Agency Logo */}
				<div className="relative h-44 w-full overflow-hidden bg-muted rounded-md">
					<img
						src={
							data.logo ||
							"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRClj1E1d5NZYvY6qYcOqN3QTKqDcPYCF-E9kRmOPY3AyAm2wQq8bAb6U&s=10"
						}
						alt={`${data.name} logo`}
						className="h-full w-full object-cover rounded-md"
					/>

					{/* Status */}
					<div className="absolute right-3 top-3">
						<Badge
							variant={data.is_active ? "default" : "secondary"}
							className="bg-white/90 text-black shadow-sm"
						>
							<span
								className={`mr-2 h-2 w-2 rounded-full ${data.is_active ? "bg-green-500" : "bg-gray-400"
									}`}
							/>
							{data.is_active ? "Active" : "Inactive"}
						</Badge>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-2 px-5">
				{/* Name */}
				<div>
					<CardTitle className="text-xl">
						{data.name}
					</CardTitle>

					<p className="mt-1 text-sm text-muted-foreground">
						{data.city}, {data.state}, {data.country}
					</p>
				</div>

				{/* Contact */}
				<div className="space-y-2 text-sm pb-2">
					<div className="flex items-center gap-2">
						<Mail className="h-4 w-4 text-muted-foreground" />
						<span className="truncate">
							{data.email_id}
						</span>
					</div>

					<div className="flex items-center gap-2">
						<Phone className="h-4 w-4 text-muted-foreground" />
						<span>{data.phone_number}</span>
					</div>
				</div>

				{/* Footer */}
				<div className="flex items-baseline-last justify-between gap-2 border-t pt-4">
					<div className="">
						<p className="text-xs text-muted-foreground">
							Owner
						</p>

						<p className="text-sm font-medium">
							{data.owner.first_name} {data.owner.last_name}
						</p>
					</div>

					<Button
						variant="outline"
						size="sm"
						className=""
						onClick={() => navigate(`/view-agency/${data.id}`)}
					>
						View Details
						<ArrowRight className="ml-2 h-4 w-4" />
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}