import { Moon, Sun } from "lucide-react";
import type { GetItineraryInterface } from "../../../interfaces/itinerary.interface";
import { Separator } from "../../ui/separator";
import type { Dispatch, SetStateAction } from "react";

interface ItinerarySectionProps {
	section: GetItineraryInterface,
	isLast: boolean,
	isUpdate: boolean,
	setIsUpdate: Dispatch<SetStateAction<boolean>>
}

export const ItinerarySection = ({
	section,
	isLast,
}: ItinerarySectionProps) => {
	const isDay = section.type === "DAY";

	return (
		<div>
			<div className="flex items-center gap-2">
				{isDay ? (
					<Sun
						size={20}
						className="text-orange-600"
					/>
				) : (
					<Moon
						size={20}
						className="text-purple-700"
					/>
				)}

				<h3 className="text-lg font-bold uppercase tracking-wide">
					{isDay
						? `Day ${section.day_number}`
						: `Night ${section.night_number}`}
				</h3>
			</div>

			{section.title && (
				<p className="mt-0 px-7 text-base italic text-muted-foreground">
					{section.title}
				</p>
			)}

			{section.description && (
				<p className="mt-0 px-7 text-base italic text-muted-foreground">
					{section.description}
				</p>
			)}

			<ol className="mt-4 space-y-1 px-6">
				{section.items.map((item, index) => (
					<li
						key={item.id}
						className="flex gap-2 text-base leading-relaxed"
					>
						<span className="shrink-0 font-semibold">
							{index + 1}.
						</span>

						<span>
							<span className="font-semibold">
								{item.title}
							</span>

							{item.description && (
								<span className="text-muted-foreground">
									{" "}— {item.description}
								</span>
							)}
						</span>
					</li>
				))}
			</ol>

			{!isLast && <Separator className="mt-8" />}
		</div>
	);
};