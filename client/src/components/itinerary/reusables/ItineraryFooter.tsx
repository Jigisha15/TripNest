import { Separator } from "../../ui/separator"

export const ItineraryFooter = ({ agency_name }: { agency_name: string }) => {
	return (
		<div className="mt-14 text-center" >

			<Separator />

			<h3 className="mt-8 text-2xl font-semibold text-slate-800">
				Thank You!
			</h3>

			<p className="mt-2 text-slate-500">
				We wish you a safe and memorable journey.
			</p>

			<p className="mt-6 text-sm uppercase tracking-widest text-slate-400">
				{agency_name}
			</p>

		</div>
	)
}