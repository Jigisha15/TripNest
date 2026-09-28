import { Skeleton } from "../ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

export const TableSkeleton = () => {
	return (
		<div className="md:w-[80%] mx-5 md:mx-auto my-5 overflow-hidden rounded-md border">
			<Table className="w-full">
				<TableHeader>
					<TableRow>
						{Array.from({ length: 5 }).map((_, index) => (
							<TableHead key={index}>
								<Skeleton className="h-5 w-full" />
							</TableHead>
						))}
					</TableRow>
				</TableHeader>

				<TableBody>
					{Array.from({ length: 3 }).map((_, rowIndex) => (
						<TableRow key={rowIndex}>
							{Array.from({ length: 5 }).map(
								(_, columnIndex) => (
									<TableCell key={columnIndex}>
										<Skeleton className="h-5 w-full" />
									</TableCell>
								)
							)}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}