import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";

import { AuthPage } from "../pages/AuthPage";
import { NotFoundPage } from "../pages/NotFound";
import { LandingPage } from "../pages/LandingPage";
import { LoginPage } from "../components/auth/LoginPage";
import { RegisterPage } from "../components/auth/RegisterPage";
import { ProfilePage } from "../pages/ProfilePage";
import { AgencyPage } from "../pages/AgencyPage";
import { TripsPage } from "../pages/TripsPage";
import ProtectedRoute from "../components/common/ProtectedRoute";
import { ItineraryPage } from "../pages/ItineraryPage";
import { BookTripPage } from "../pages/BookTripPage";
import { BookingsPage } from "../pages/Bookings";
import { ListYourAgency } from "../pages/ListYourAgency";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		children: [
			{
				index: true,
				element: <LandingPage />,
			},
			{
				path: "auth",
				element: <AuthPage />,
				children: [
					{
						index: true,
						element: <LoginPage />, // /auth
					},
					{
						path: "login",
						element: <LoginPage />, // /auth/login
					},
					{
						path: "register",
						element: <RegisterPage />, // /auth/register
					},
				],
			},
			{
				element: <ProtectedRoute />,
				children: [
					{
						path: "/profile",
						element: <ProfilePage />,
					},
					{
						path: "/agency",
						element: <AgencyPage />,
					},
					{
						path: "/trips/:agency_id/:agency_name",
						element: <TripsPage />,
					},
					{
						path: "/book-trip/:agency_id/:agency_name/:trip_id/:user_id",
						element: <BookTripPage />
					},
					{
						path: "/itinerary/:agency_id/:agency_name/:trip_id/:trip_name",
						element: <ItineraryPage />
					},
					{
						path: "/bookings/:user_id",
						element: <BookingsPage />
					}
				],
			},
			{
				path: "/list-your-agency",
				element: <ListYourAgency />
			},
			{
				path: "*",
				element: <NotFoundPage />,
			},
		],
	},
]);