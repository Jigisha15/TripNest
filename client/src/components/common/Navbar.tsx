import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import toast from "react-hot-toast";
import { logout } from "../../features/authSlice";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

const navItems = [
	{ name: "Home", href: "/" },
	{ name: "List Your Agency", href: "/list-your-agency" }
	//{ name: "Trips", href: "/trips" },
];

export const Navbar = () => {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();

	const user = useSelector((state: RootState) => state.auth.user);

	const handleLogout = () => {
		dispatch(logout());

		localStorage.removeItem("token");

		toast.success("Logged out successfully!");

		navigate("/auth");
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-white/20 backdrop-blur">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* Logo */}
				<Link
					to="/"
					className="text-2xl font-bold text-blue-800"
				>
					Traveller
				</Link>

				{/* Desktop Menu */}
				<nav className="hidden items-center gap-6 md:flex">
					{navItems.map((item) => (
						<Link
							key={item.name}
							to={item.href}
							className="text-sm font-medium hover:text-blue-600"
						>
							{item.name}
						</Link>
					))}

					{user ? (
						<div className="flex items-center justify-center gap-4">
							<div className="">
								<Link
									to="/profile"
									className="text-sm font-medium hover:text-blue-600"
								>
									Profile
								</Link>
							</div>

							{/* if the user type is not user then show a create agency page as well */}
							{/*{user.role !== "USER" && (*/}
							<div className="">
								<Link
									to="/agency"
									className="text-sm font-medium hover:text-blue-600"
								>
									Agency
								</Link>
							</div>

							<div className="">
								<Link
									to={`/bookings/${user.id}`}
									className="text-sm font-medium hover:text-blue-600"
								>
									Bookings
								</Link>
							</div>
							{/*)}*/}

							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button
										variant="link"
										className="cursor-pointer px-0 hover:text-blue-600 hover:no-underline"
									>
										Logout
									</Button>
								</AlertDialogTrigger>

								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Are you sure?
										</AlertDialogTitle>

										<AlertDialogDescription>
											You will be logged out of your account.
										</AlertDialogDescription>
									</AlertDialogHeader>

									<AlertDialogFooter>
										<AlertDialogCancel variant={undefined} size={undefined} className="cursor-pointer">
											Cancel
										</AlertDialogCancel>

										<AlertDialogAction onClick={handleLogout} variant={undefined} size={undefined} className="cursor-pointer">
											Logout
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					) : (
						<Link
							to="/auth"
							className="text-sm font-medium hover:text-blue-600"
						>
							Login
						</Link>
					)}
				</nav>

				{/* Mobile Menu */}
				<Sheet>
					<SheetTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="md:hidden"
						>
							<Menu className="h-6 w-6" />
						</Button>
					</SheetTrigger>

					<SheetContent side="right" className="w-72">
						<div className="mt-8 flex flex-col gap-4">
							{navItems.map((item) => (
								<SheetClose asChild key={item.name}>
									<Link
										to={item.href}
										className="rounded-md px-3 py-2 hover:bg-muted"
									>
										{item.name}
									</Link>
								</SheetClose>
							))}

							{user ? (
								<div className="flex items-center justify-center gap-4">
									<div className="">
										<Link
											to="/profile"
											className="text-sm font-medium hover:text-blue-600"
										>
											Profile
										</Link>
									</div>

									{/* if the user type is not user then show a create agency page as well */}
									{/*{user.role !== "USER" && (*/}
									<div className="">
										<Link
											to="/agency"
											className="text-sm font-medium hover:text-blue-600"
										>
											Agency
										</Link>
									</div>

									<div className="">
										<Link
											to={`/bookings/${user.id}`}
											className="text-sm font-medium hover:text-blue-600"
										>
											Bookings
										</Link>
									</div>
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button
												variant="link"
												className="cursor-pointer px-3 hover:text-blue-600 hover:no-underline flex items-start justify-start font-normal"
											>
												Logout
											</Button>
										</AlertDialogTrigger>

										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>
													Are you sure?
												</AlertDialogTitle>

												<AlertDialogDescription>
													You will be logged out of your account.
												</AlertDialogDescription>
											</AlertDialogHeader>

											<AlertDialogFooter>
												<AlertDialogCancel variant={undefined} size={undefined} className="cursor-pointer">
													Cancel
												</AlertDialogCancel>

												<AlertDialogAction onClick={handleLogout} variant={undefined} size={undefined} className="cursor-pointer">
													Logout
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>
							) : (
								<Link
									to="/auth"
									className="text-sm font-normal hover:text-blue-600 px-3"
								>
									Login
								</Link>
							)}
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</header >
	);
};