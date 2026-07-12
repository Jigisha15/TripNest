import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import type { GetReviewInterface } from "../../interfaces/review.interface"

interface GetReviewDataInterface {
	data: GetReviewInterface
}

export const ReviewData = ({ data }: GetReviewDataInterface) => {
	return (
		<>
			{data ? (
				<div className=""></div>
			) : (
				<Card className="overflow-hidden rounded-2xl shadow-lg w-full">
					<CardHeader className="border-b bg-slate-50 py-0">
						<CardTitle className="text-2xl font-bold">
							My Reviews
						</CardTitle>
					</CardHeader>
					<CardContent className="py-4 text-center">
						No Reviews available
					</CardContent>
				</Card>
			)}
		</>
	)
}