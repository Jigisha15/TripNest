import { Link } from "react-router-dom"
import { Button } from "../ui/button"

export const HeroSection = () => {
	return (
		<div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
			{/* Hero Section */}
			<section className="max-w-7xl mx-auto px-4 py-20">
				<div className="text-center">
					<h2 className="text-5xl font-bold text-gray-900 mb-6">
						Discover Your Next Adventure
					</h2>
					<p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
						Explore amazing trips curated by travel agencies worldwide. Book your next journey with confidence.
					</p>
					<div className="flex gap-4 justify-center">
						<Link to="/auth/register">
							<Button size="lg">Start Exploring</Button>
						</Link>
						<Link to="/auth/login">
							<Button variant="outline" size="lg">Sign In</Button>
						</Link>
					</div>
				</div>
			</section>
		</div>
	)
}