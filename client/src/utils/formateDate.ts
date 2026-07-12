export const formatDate = (date: string | Date): string => {
	const parsedDate = new Date(date);

	return parsedDate.toLocaleDateString("en-US", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
};