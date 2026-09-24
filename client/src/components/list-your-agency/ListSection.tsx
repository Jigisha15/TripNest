import { Info, X } from "lucide-react"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTrigger } from "../ui/alert-dialog"
import { Link } from "react-router-dom"

interface ListSectionInterface {
	data: any,
	user: any,
	main_title: string,
	top_p: string,
	color: string
}

export const ListSection = ({ data, user, main_title, top_p, color }: ListSectionInterface) => {

	return (
		<div className="">

			<div className="my-5 flex flex-col gap-3 md:gap-5 items-center justify-center">
				<h1 className="text-3xl md:text-5xl font-bold">{main_title}</h1>
				<p className="md:w-200 text-sm md:text-lg text-center">{top_p}</p>
			</div>

			<div className="w-[55%] mx-auto grid md:grid-cols-3 gap-6 items-center justify-center">
				{data.map((d: any) => (
					<AlertDialog key={d.id}>

						<AlertDialogTrigger asChild>
							<div
								className={`cursor-pointer hover:no-underline transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:bg-[${color}] hover:shadow-lg w-65 h-65 border border-gray-200 rounded-md text-black flex flex-col gap-5 items-center justify-center`}
								style={{ backgroundColor: `${color}` }}
							>
								{d.icon1}
								<h1 className="font-semibold text-2xl w-[80%] text-center">{d.title}</h1>
								<Info size={25} color="red" />
							</div>
						</AlertDialogTrigger>

						<AlertDialogContent className="gap-0">
							<div className="w-full">
								<AlertDialogCancel className="justify-end w-fit border-0 hover:bg-transparent float-end">
									<div className="cursor-pointer w-6 h-6 p-3 rounded-full flex items-center justify-center border border-red-200 bg-red-50 hover:bg-red-100">
										<X
											className="w-4 h-4"
											strokeWidth={3}
											color="red"
										/>
									</div>
								</AlertDialogCancel>
							</div>

							<AlertDialogHeader>
								<AlertDialogDescription className="flex flex-col items-center justify-center gap-3 mx-auto w-full">
									<div className="flex flex-col items-center justify-center gap-3 text-black">
										<h1 className="">
											{d.icon1}
										</h1>
										<h1 className="text-2xl font-bold">{d.title}</h1>
										<p className="text-base font-base text-center">{d.text}</p>
									</div>

									{!user || user.role === "AGENCY_USER" ? (
										<Link
											to={!user ? "/login" : "/agency"}
											className="bg-blue-100 hover:bg-blue-100 hover:shadow-md font-semibold px-8 py-2 text-black text-lg rounded-sm no-underline hover:no-underline focus:no-underline active:no-underline"
										>
											List your Agency
										</Link>
									) : null}
								</AlertDialogDescription>
							</AlertDialogHeader>
						</AlertDialogContent>
					</AlertDialog>
				))}
			</div >

			<div className="w-fit my-8 mx-auto">
				{!user || user.role === "AGENCY_USER" ? (
					<Link
						to={!user ? "/login" : "/agency"}
						className="bg-blue-100 hover:bg-blue-100 hover:shadow-md font-semibold px-8 py-2 text-black text-lg rounded-sm no-underline hover:no-underline focus:no-underline active:no-underline"
						style={{ backgroundColor: `${color}` }}
					>
						List your Agency
					</Link>
				) : null}
			</div>

		</div >
	)
}