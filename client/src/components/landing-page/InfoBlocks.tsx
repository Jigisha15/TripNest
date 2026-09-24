import { Card, CardContent, CardHeader } from "../ui/card"

interface InfoBlockInterface {
	agencies: {
		active: number,
		total: number,
	},
	trips: {
		active: number
		completed: number
		inactive: number
		ongoing: number
		total: number
		upcoming: number
	},
	users: {
		monthly: any[],
		total: number
	}
}

export const InfoBlock = ({ agencies, trips, users }: InfoBlockInterface) => {

	const data = [
		{
			id: 1,
			top_text: `${agencies.total - 1} +`,
			text: "Agencies"
		},
		{
			id: 2,
			top_text: `${trips.total - 1} +`,
			text: "Trips"
		},
		{
			id: 3,
			top_text: `${users.total - 1} +`,
			text: "Users"
		},
	]

	return (
		<div className="">
			<h1 className="text-center my-10 text-3xl font-bold">Quick Insights</h1>

			<div className="flex flex-wrap gap-4 my-5 items-center justify-center">
				{data.map((d) => (
					<Card key={d.id} className="w-50 text-center gap-2 bg-blue-50">
						<CardHeader className="text-2xl font-bold text-[#0E2269]">
							{d.top_text}
						</CardHeader>

						<CardContent className="text-lg font-semibold">
							{d.text}
						</CardContent>
					</Card>
				))}
			</div>

			{/*<img src="https://img.magnific.com/premium-vector/let-s-go-travel-text-with-airplane-black-sketch-isolated-white-background-travel-illustration_508396-1192.jpg?semt=ais_hybrid&w=740&q=80" alt="" />*/}
		</div>
	)
}