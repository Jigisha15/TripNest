import { useSelector } from "react-redux"
//import { FeaturesSection } from "../components/landing-page/FeaturesSection"
//import { HeroSection } from "../components/landing-page/HeroSection"
import type { RootState } from "../app/store"
import { redirect } from "react-router-dom"
import { UpcomingTripsCard } from "../components/landing-page/UpcomingTripsCard"

export const LandingPage = () => {

	const user = useSelector((st: RootState) => st.auth.user)

	if (!user) {
		redirect("/auth/login")
	}

	return (
		<div className="">
			<UpcomingTripsCard />
			{/*<HeroSection />*/}
			{/*<FeaturesSection />*/}
		</div>
	)
}