import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

const ProtectedRoute = () => {
	const user = useSelector((state: RootState) => state.auth.user);

	//useEffect(() => {
	//	if (!user) {
	//		toast.error("Access denied");
	//	}
	//}, [user]);

	if (!user) {
		return <Navigate to="/auth/login" replace />;
		//return (
		//	<Navigate
		//		to="/auth/login"
		//		replace
		//		state={{ message: "Please log in to continue." }}
		//	/>
		//);
	}

	return <Outlet />;
};

export default ProtectedRoute;