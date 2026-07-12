import { Outlet } from "react-router-dom";

import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";

export const RootLayout = () => {
	return (
		<>
			<Navbar />

			<main className="min-h-screen">
				<Outlet />
			</main>

			<Footer />
		</>
	);
};