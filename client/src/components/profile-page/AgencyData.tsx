import type { GetAgencyInterface } from "../../interfaces/agency.interface"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

interface GetAgencyDataInterface {
	data: GetAgencyInterface
}

export const AgencyData = ({ data }: GetAgencyDataInterface) => {
	return (
		<>
			{data ? (
				<Card className="overflow-hidden rounded-2xl shadow-lg py-0 w-full">
					<CardHeader className="border-b bg-slate-50 py-4">
						<CardTitle className="text-2xl font-bold">
							Agency Details
						</CardTitle>
					</CardHeader>

					<CardContent className="grid gap-10 p-8 md:grid-cols-[260px_1fr]">
						{/* Right Section */}
						<div className="grid gap-6 md:grid-cols-2">
							<div className="space-y-2">
								<Label>Name</Label>
								<Input
									name="name"
									value={data.name}
									readOnly
								/>
							</div>

							<div className="space-y-2">
								<Label>Email Address</Label>
								<Input
									name="email_id"
									value={data.email_id}
									readOnly
								/>
							</div>

							<div className="space-y-2">
								<Label>Phone Number</Label>
								<Input
									name="phone_number"
									value={data.phone_number}
									readOnly
								/>
							</div>
						</div>
					</CardContent>
				</Card>
			) : (
				<Card className="overflow-hidden rounded-2xl shadow-lg w-full">
					<CardHeader className="border-b bg-slate-50 py-0">
						<CardTitle className="text-2xl font-bold">
							My Agency
						</CardTitle>
					</CardHeader>
					<CardContent className="py-4 text-center">
						No Agency Alotted
					</CardContent>
				</Card>
			)}
		</>
	)
}