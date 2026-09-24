import { useRef } from "react"
import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import { Card, CardContent } from "../ui/card"

const images = [
	{
		id: 1,
		src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_ODVFgj0-ngQqEX6zLN-63nXLi08s0P6ZxV2i4kT7jd5QOmqAataYXkWj&s=10",
	},
	{
		id: 2,
		src: "https://www.rmcad.edu/wp-content/uploads/2024/12/shutterstock_2176161815-scaled.jpg",
	},
	{
		id: 3,
		src: "https://img.magnific.com/free-photo/couple-family-traveling-together_1150-7772.jpg?semt=ais_hybrid&w=740&q=80",
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