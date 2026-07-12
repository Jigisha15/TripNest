export const FeaturesSection = () => {
	return (
		<div className="bg-white py-20">
			<div className="max-w-7xl mx-auto px-4">
				<h3 className="text-3xl font-bold text-center mb-12">Why Choose TravelHub?</h3>
				<div className="grid md:grid-cols-3 gap-8">
					<div className="p-6 border border-gray-200 rounded-lg">
						<div className="text-3xl mb-4">🗺️</div>
						<h4 className="text-xl font-semibold mb-2">Curated Trips</h4>
						<p className="text-gray-600">
							Carefully selected trips from trusted travel agencies around the world.
						</p>
					</div>
					<div className="p-6 border border-gray-200 rounded-lg">
						<div className="text-3xl mb-4">🔒</div>
						<h4 className="text-xl font-semibold mb-2">Secure Bookings</h4>
						<p className="text-gray-600">
							Safe and easy booking process with verified agencies and clear cancellation policies.
						</p>
					</div>
					<div className="p-6 border border-gray-200 rounded-lg">
						<div className="text-3xl mb-4">⭐</div>
						<h4 className="text-xl font-semibold mb-2">Trusted Reviews</h4>
						<p className="text-gray-600">
							Read genuine reviews from travelers who have completed the trips.
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}