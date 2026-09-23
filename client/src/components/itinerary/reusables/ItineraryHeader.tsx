import { Card } from "../../ui/card"

interface ItineraryHeaderProps {
	agency_name: string,
	title: string,
	description: string,
	short_description: string
}

export const ItineraryHeader = ({ agency_name, title, description, short_description }: ItineraryHeaderProps) => {
	return (
		<Card className="w-full rounded-lg bg-blue-100 border border-blue-200 p-5 text-center gap-0">
			<h2 className="text-base font-semibold uppercase tracking-[0.3rem] text-slate-700">
				{agency_name}
			</h2>

			<h1 className="mt-1 text-4xl font-bold text-slate-800">
				{title}
			</h1>

			<p className="mt-1 text-sm text-slate-600">
				{description}
			</p>

			<p className="mt-1 text-sm text-slate-600">
				{short_description}
			</p>
		</Card>
	)
}