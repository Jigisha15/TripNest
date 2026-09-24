import { Card, CardContent, CardHeader } from "../../ui/card"

export const IconCards = ({ top_text, text }: { top_text: any, text: string }) => {
	return (
		<Card className="w-60 items-center justify-center gap-4 bg-blue-50">
			<CardHeader className="flex h-10 w-10 items-center justify-center p-0 text-2xl font-bold">
				{top_text}
			</CardHeader>

			<CardContent className="text-lg font-semibold text-center">
				{text}
			</CardContent>
		</Card>
	)
}