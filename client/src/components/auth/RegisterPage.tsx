import { Link, useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { useState, type ChangeEvent } from "react"
import type { RegisterInterface } from "../../interfaces/auth.interface"
import { useRegister } from "../../api/auth/auth-mutation"
import toast from "react-hot-toast"
import { Spinner } from "../ui/spinner"

export const RegisterPage = () => {

	const [errors, setErrors] = useState<Record<string, string>>({});

	const [userData, setUserData] = useState<RegisterInterface>({
		first_name: "",
		last_name: "",
		email_id: "",
		phone_number: "",
		password: "",
		role: ""
	})

	const roles = [
		{
			label: "Admin",
			value: "ADMIN",
		},
		{
			label: "Traveller",
			value: "USER",
		},
		{
			label: "Agency User",
			value: "AGENCY_USER",
		},
	];

	const { mutateAsync: registerMutation, isPending } = useRegister()
	//const dispatch = useDispatch()

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		setUserData(prev => ({
			...prev,
			[name]: value,
		}));

		setErrors(prev => ({
			...prev,
			[name]: "",
		}));
	};

	const resetForm = () => {
		setUserData({
			first_name: "",
			last_name: "",
			email_id: "",
			phone_number: "",
			password: "",
			role: "",
		})
	}

	const navigate = useNavigate();

	const handleRegister = async () => {
		try {

			if (!userData.role) {
				toast.error("Select Role")
				return
			}

			const response = await registerMutation(userData)
			toast.success(response.message || "User registered successfully!")
			navigate("/auth/login");

			resetForm()
		} catch (error: any) {

			if (error.response?.data?.error?.details) {

				const fieldErrors: Record<string, string> = {};

				error.response.data.error.details.forEach((err: any) => {
					fieldErrors[err.path[0]] = err.message;
				});

				setErrors(fieldErrors);

				toast.error("Please fix the highlighted fields.");

				return;
			}

			toast.error(error.response?.data?.message || "Registration failed.");
		}
	}

	return (
		<>
			{isPending ? (
				<div className="">Loading</div>
			) : (
				<Card className="w-80 md:w-120 rounded-md gap-0">

					<CardHeader className="pb-3">
						<CardTitle>Register</CardTitle >
						<CardDescription>Register yourself</CardDescription>
					</CardHeader >

					<CardContent className="border-t pt-5 pb-3 flex flex-col gap-3 justify-center">

						<div className="flex gap-3">
							<Label className="w-40">First Name <span className="text-red-600">*</span></Label>
							<div className="w-full">
								<Input
									className="w-full"
									type="text"
									placeholder="Enter First Name"
									name="first_name"
									value={userData.first_name}
									onChange={handleChange}
									required
								/>
								{errors.first_name && (
									<p className="text-sm text-red-500 w-full">
										{errors.first_name}
									</p>
								)}
							</div>
						</div>

						<div className="flex gap-3">
							<Label className="w-40">Last Name <span className="text-red-600">*</span></Label>
							<div className="w-full">
								<Input
									className="w-full"
									type="text"
									placeholder="Enter Last Name"
									name="last_name"
									value={userData.last_name}
									onChange={handleChange}
									required
								/>
								{errors.last_name && (
									<p className="text-sm text-red-500 w-full">
										{errors.last_name}
									</p>
								)}
							</div>
						</div>

						<div className="flex gap-3">
							<Label className="w-40">Email Id <span className="text-red-600">*</span></Label>
							<div className="w-full">
								<Input
									className="w-full"
									type="email"
									placeholder="Enter Email Id"
									name="email_id"
									value={userData.email_id}
									onChange={handleChange}
									required
								/>
								{errors.email_id && (
									<p className="text-sm text-red-500 w-full">
										{errors.email_id}
									</p>
								)}
							</div>
						</div>

						<div className="flex gap-3">
							<Label className="w-40">Phone Number <span className="text-red-600">*</span></Label>
							<div className="w-full">
								<Input
									className="w-full"
									type="text"
									placeholder="Enter Phone Number"
									name="phone_number"
									value={userData.phone_number}
									onChange={handleChange}
									required
								/>
								{errors.phone_number && (
									<p className="text-sm text-red-500 w-full">
										{errors.phone_number}
									</p>
								)}
							</div>
						</div>

						<div className="flex gap-3">
							<Label className="w-40">Password <span className="text-red-600">*</span></Label>
							<div className="w-full">
								<Input
									className="w-full"
									type="password"
									placeholder="Enter Password"
									name="password"
									value={userData.password}
									onChange={handleChange}
									required
								/>
								{errors.password && (
									<p className="text-sm text-red-500 w-full">
										{errors.password}
									</p>
								)}
							</div>
						</div>

						<div className="flex gap-3">
							<Label className="w-40">Role <span className="text-red-600">*</span></Label>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className="w-80 justify-between"
									>
										{userData.role || "Select Role"}

										<ChevronDown className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>

								<DropdownMenuContent className="w-56">
									<DropdownMenuLabel>Select Role</DropdownMenuLabel>

									{roles.map((role) => (
										<DropdownMenuItem
											key={role.value}
											onClick={() =>
												setUserData((prev) => ({
													...prev,
													role: role.value,
												}))
											}
										>
											{role.label}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						<Button
							onClick={handleRegister}
							disabled={isPending}
							className="w-fit mx-auto px-6 cursor-pointer"
						>
							{isPending ? (
								<div className="flex items-center justify-center gap-2"><Spinner />Registering...</div>
							) : "Register"}
						</Button>

					</CardContent >
					<CardFooter className="flex items-center justify-center bg-inherit">
						<p>Already a User? <Link to={"/auth/login"} className="text-blue-500">Login</Link></p>
					</CardFooter>
				</Card >
			)}
		</>
	)
}