import { Card } from "../../ui/card";

interface TripDetailCardProps {
	title: string;
	value: React.ReactNode;
}

export const TripDetailCard = ({ title, value }: TripDetailCardProps) => {
	return (
		<Card className="w-65 text-center gap-1">
			<h3 className="text-lg font-semibold">
				{title}
			</h3>

			<p className="text-base">
				{value}
			</p>
		</Card>
	)
}