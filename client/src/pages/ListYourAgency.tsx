import { ChartColumnIncreasing, Handshake, IndianRupee, NotebookPen, Plus, SquareChartGantt, UserCheck, Lock, ListCheck, Brain } from "lucide-react"
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { ListSection } from "../components/list-your-agency/ListSection";

export const ListYourAgency = () => {

	const user = useSelector((state: RootState) => state.auth.user);

	const hostData = [
		{
			id: 1,
			icon1: <Plus size={80} strokeWidth={1} color="black" />,
			title: "Create Your Agency",
			text: "Set up your agency and build your travel business",
		},
		{
			id: 2,
			icon1: <SquareChartGantt size={80} strokeWidth={1} color="black" />,
			title: "Manage Your Agency",
			text: "Manage your agency details, users, and operations",
		},
		{
			id: 3,
			icon1: <NotebookPen size={80} strokeWidth={1} color="black" />,
			title: "Organize Trips",
			text: "Create and manage trips, itineraries, and schedules",
		},
		{
			id: 4,
			icon1: <UserCheck size={80} strokeWidth={1} color="black" />,
			title: "Manage Agency Users",
			text: "Add team members and manage their access",
		},
		{
			id: 5,
			icon1: <IndianRupee size={80} strokeWidth={1} color="black" />,
			title: "Accept Digital Payments",
			text: "Collect and manage payments securely online",
		},
		{
			id: 6,
			icon1: <ChartColumnIncreasing size={80} strokeWidth={1} color="black" />,
			title: "Analyze Your Data",
			text: "Track performance and gain insights from your data",
		},
	];

	const serviceData = [
		{
			id: 1,
			icon1: <NotebookPen size={80} strokeWidth={1} color="black" />,
			title: "Travel Planning",
			text: "Plan and organize personalized travel experiences with ease",
		},
		{
			id: 2,
			icon1: <SquareChartGantt size={80} strokeWidth={1} color="black" />,
			title: "Trip Management",
			text: "Manage bookings, itineraries, schedules, and trip details in one place",
		},
		{
			id: 3,
			icon1: <Handshake size={80} strokeWidth={1} color="black" />,
			title: "Agency Support",
			text: "Get the tools you need to simplify your day-to-day agency operations",
		},
		{
			id: 4,
			icon1: <Lock size={80} strokeWidth={1} color="black" />,
			title: "Secure Payments",
			text: "Make and receive digital payments through a secure payment experience",
		},
		{
			id: 5,
			icon1: <ListCheck size={80} strokeWidth={1} color="black" />,
			title: "Itinerary Planning",
			text: "Keep your team connected and make managing travel operations easier",
		},
		{
			id: 6,
			icon1: <Brain size={80} strokeWidth={1} color="black" />,
			title: "Business Insights",
			text: "Turn your business data into useful insights for better decisions",
		},
	];

	return (
		<div className="">

			<ListSection
				data={hostData}
				user={user}
				main_title="What you can host?"
				top_p="As the architect of adventure, Traveller empowers your journey with end-to-end solutions from the moment you book to the return home. Let's explore where you can go."
				color="#EFF6FF"
			/>

			<div className="mt-20">
				<ListSection
					data={serviceData}
					user={user}
					main_title="What we offer you?"
					top_p="As the architect of adventure, Traveller empowers your journey with end-to-end solutions from the moment you book to the return home. Let's explore where you can go."
					color="#FCF1F1"
				/>
			</div>


			<div className="md:w-150 text-center mx-auto my-20">
				<h1 className="text-2xl mx-5 md:text-4xl font-bold">Sit back and watch your itinerary come to life</h1>
				<p className="text-base md:text-lg mx-5 mt-3">Vacations may be all fun and relaxation, but we take logistics seriously. We ensure your trip's safety so that you don't have to</p>
			</div>
		</div >
	)
}