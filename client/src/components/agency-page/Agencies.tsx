import type { GetAgencyInterface } from "../../interfaces/agency.interface"
import { AgencyCard } from "./AgencyCard"

interface AgenciesInterface {
	data: GetAgencyInterface[]
}

export const Agencies = ({ data }: AgenciesInterface) => {

	return (
		<div className="">
			<h1 className="mb-5 text-center text-4xl font-semibold">All Agencies</h1>
			<div className="grid sm:grid-cols-2 md:grid-cols-3 items-center justify-center gap-5">
				{data.map((d) => (
					<AgencyCard key={d.id} data={d} />
				))}
			</div>
		</div>
	)
}