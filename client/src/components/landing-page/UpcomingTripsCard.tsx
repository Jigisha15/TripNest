import { Card } from "../ui/card"

interface UpcomingTripsCardInterface {
	data: {
		active: number,
		inactive: number,
		total: number,
		completed: number,
		upcoming: number,
		ongoing: number,
	},
}

export const UpcomingTripsCard = ({ data }: UpcomingTripsCardInterface) => {

	const newData = [
		{
			id: 1,
			h1: data.total,
			p: "Total Trips"
		},
		{
			id: 2,
			h1: data.active,
			p: "Active Trips"
		},
		{
			id: 3,
			h1: data.inactive,
			p: "Inactive Trips"
		},
		{
			id: 4,
			h1: data.ongoing,
			p: "Ongoing Trips"
		},
		{
			id: 5,
			h1: data.completed,
			p: "Completed Trips"
		},
		{
			id: 6,
			h1: data.upcoming,
			p: "Upcoming Trips"
		}
	]

	return (
		<div className="w-full flex flex-col items-center justify-center">
			<h1 className="text-3xl font-bold text-center my-5">Trip Data</h1>

			<div className="w-full flex flex-wrap items-center justify-center gap-5">
				{newData.map((d) => (
					<Card key={d.id} className="gap-1 text-center px-5">
						<h1 className="text-xl font-bold">{d.h1}</h1>
						<p className="text-base font-semibold">{d.p}</p>
					</Card>
				))}

			</div >
		</div >
	)
}