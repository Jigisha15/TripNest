import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "./dashboard";

export const useGetDashboard = () => {
	return useQuery({
		queryKey: ["dashboard"],
		queryFn: () => getDashboard(),
	});
};