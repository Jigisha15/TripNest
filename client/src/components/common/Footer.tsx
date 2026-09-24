import { Link } from "react-router-dom"

export const Footer = () => {
	return (
		<div className="w-full text-center border-t py-2 font-semibold">
			Developed by <Link
				to="https://jigisha-ghanekar.vercel.app/"
				target="_blank"
				className="text-[#0E2269] underline underline-offset-2"
			>
				Jigisha Ghanekar
			</Link>
		</div>
	)
}