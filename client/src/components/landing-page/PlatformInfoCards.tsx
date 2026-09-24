import { IndianRupee, ListCheck, MessageCircle, NotebookPen, Search, SearchCheck } from "lucide-react"
import { IconCards } from "./reusable/IconCards"

export const PlatformInfoCards = () => {

	const data = [
		{
			id: 1,
			top_text: <SearchCheck size={35} color="#0E2269" />,
			text: "Discover"
		},
		{
			id: 2,
			top_text: <NotebookPen size={35} color="#0E2269" />,
			text: "Plan Trips"
		},
		{
			id: 3,
			top_text: <Search size={35} color="#0E2269" />,
			text: "Find Agencies"
		},
		{
			id: 4,
			top_text: <IndianRupee size={35} color="#0E2269" />,
			text: "Secure Payments"
		},
		{
			id: 5,
			top_text: <ListCheck size={35} color="#0E2269" />,
			text: "Manage Bookings"
		},
		{
			id: 6,
			top_text: <MessageCircle size={35} color="#0E2269" />,
			text: "Share Your Experience"
		},
	]

	return (
		<div className="text-center my-10">
			<h1 className="text-3xl font-bold">Everything you need for your journey</h1>
			<p className="text-base mt-1">From discovering the perfect destination to booking
				your trip, Traveller brings everything together.</p>

			<div className="w-[50%] mx-auto grid md:grid-cols-3 items-center justify-center gap-5 my-5">
				{data.map((d) => (
					<IconCards
						key={d.id}
						top_text={d.top_text}
						text={d.text}
					/>
				))}
			</div>
		</div>
	)
}