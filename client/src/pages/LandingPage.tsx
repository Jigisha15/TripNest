import { useSelector } from "react-redux"
//import { FeaturesSection } from "../components/landing-page/FeaturesSection"
//import { HeroSection } from "../components/landing-page/HeroSection"
import type { RootState } from "../app/store"
import { redirect } from "react-router-dom"
import { useGetDashboard } from "../api/dashboard/dashboard-mutation"
import { Card } from "../components/ui/card"
import { CarouselImage } from "../components/landing-page/CarouselImage"
import { InfoBlock } from "../components/landing-page/InfoBlocks"
import { PlatformInfoCards } from "../components/landing-page/PlatformInfoCards"
import { WhyTraveller } from "../components/landing-page/WhyTraveller"

export const LandingPage = () => {

	const user = useSelector((st: RootState) => st.auth.user)

	if (!user) {
		redirect("/auth/login")
	}

	const { data, isLoading, error } = useGetDashboard()


	if (isLoading) {
		return (
			<div className="flex h-[70vh] items-center justify-center">
				<Card className="px-4 py-2">
					Loading...
				</Card>
			</div>
		);
	}

	//if (isLoading) {
	//	return (
	//		<div className="flex h-[70vh] items-center justify-center">
	//			<Card className="px-4 py-2">
	//				Loading...
	//			</Card>
	//		</div>
	//	);
	//}

	if (error) {
		return (
			<div className="flex h-[70vh] items-center justify-center">
				<Card className="px-4 py-2">
					Something went wrong.
				</Card>
			</div>
		);
	}

	return (
		<div className="">
			{/* landing carousel image */}
			<CarouselImage />

			{/* informative blocks */}
			<InfoBlock
				agencies={data.data.agencies}
				trips={data.data.trips}
				users={data.data.users}
			/>

			{/* platform information */}
			<PlatformInfoCards />

			{/* why Traveller */}
			<WhyTraveller />

			{/*upcoming trips
			<UpcomingTripsCard data={data.data.trips} />

			{/* famous trips *
			<FamousTrips data={data.data.popular_trips} />

			{/* listed agencies *
			<ListedAgencies />

			{/* reviews *
			<Reviews />*/}

		</div>
	)
}