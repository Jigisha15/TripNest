import err404 from "../assets/err404.jpg"

export const NotFoundPage = () => {
	return (
		<div className="w-full h-screen flex flex-col gap-10 items-center justify-center">
			<img
				src={err404}
				alt="404"
				className="w-100 h-100 object-contain"
			/>
			<div className="flex flex-col items-center justify-center">
				<h1 className="text-2xl md:text-3xl font-bold">ERROR 404 PAGE NOT FOUND</h1>
			</div>
		</div>
	);
};