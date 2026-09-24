import { HeartHandshake, LockKeyhole, SwatchBook } from "lucide-react"
import { IconCards } from "./reusable/IconCards"

export const WhyTraveller = () => {

	const data = [
		{
			id: 1,
			top_text: <SwatchBook size={35} color="#0E2269" />,
			title: "Simple Planning",
			text: "Plan your entire journey easily"
		},
		{
			id: 2,
			top_text: <HeartHandshake size={35} color="#0E2269" />,
			title: "Trusted Agencies",
			text: "Discover agencies you can rely on"
		},
		{
			id: 3,
			top_text: <LockKeyhole size={35} color="#0E2269" />,
			title: "Secure Payments",
			text: "Pay securely and track bookings"
		},
	]

	return (
		<div className="my-10">

			<div className="space-y-2 mt-10 text-center">
				<h1 className="px-1 md:px-0 text-3xl font-bold">Why travel with Traveller?</h1>
				<h2 className="text-lg md:text-xl font-semibold">Everything in one place</h2>
				<p className="w-full md:w-150 px-3 md:mx-auto mt-2 mb-5">Plan your trip, discover trusted agencies, manage bookings and make secure payments without jumping between platforms.</p>
			</div>

			<div className="w-full md:w-[50%] mx-auto grid md:grid-cols-3 items-center justify-center gap-5">
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