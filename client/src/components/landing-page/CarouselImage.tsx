import { useRef } from "react"
import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel"

const images = [
	{
		id: 1,
		src: "https://plus.unsplash.com/premium_photo-1677002240252-af3f88114efc?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dHJla2tpbmd8ZW58MHx8MHx8fDA%3D",
	},
	{
		id: 2,
		src: "https://www.rmcad.edu/wp-content/uploads/2024/12/shutterstock_2176161815-scaled.jpg",
	},
	{
		id: 3,
		src: "https://static.vecteezy.com/system/resources/thumbnails/010/621/917/small/person-hike-friends-helping-each-other-up-mountain-man-and-woman-giving-helping-hand-and-active-fit-lifestyle-couple-hiking-help-each-other-concept-of-friendship-teamwork-banner-with-copy-space-free-photo.jpg",
	},
]

export const CarouselImage = () => {

	const plugin = useRef(
		Autoplay({ delay: 2000, stopOnInteraction: true })
	)

	return (
		<Carousel
			plugins={[plugin.current]}
			className="w-full mx-auto"
			onMouseEnter={plugin.current.stop}
			onMouseLeave={plugin.current.reset}
		>
			<CarouselContent>
				{images.map((image, index) => (
					<CarouselItem key={image.id}>
						<div className="p-1">
							<div className="overflow-hidden rounded-xl">
								<img
									src={image.src}
									alt={`Trip image ${index + 1}`}
									className="w-full h-100 object-cover"
								/>
							</div>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
		</Carousel>
	)
}