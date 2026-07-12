import { Outlet } from "react-router-dom"

export const AuthPage = () => {
	return (
		<div className="flex items-center justify-center my-5">
			<Outlet />
		</div >
	)
}