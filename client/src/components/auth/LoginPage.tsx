import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState, type ChangeEvent } from "react";
import { useDispatch } from "react-redux"
import { setUser } from "../../features/authSlice";
import type { LoginInterface } from "../../interfaces/auth.interface";
import { useLogin } from "../../api/auth/auth-mutation";
import toast from "react-hot-toast";

export const LoginPage = () => {

	const [errors, setErrors] = useState<Record<string, string>>({});

	const [userData, setUserData] = useState<LoginInterface>({
		email_id: "",
		password: ""
	})

	const { mutateAsync: loginMutation, isPending } = useLogin()

	const dispatch = useDispatch()
	const navigate = useNavigate();

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
			email_id: "",
			password: ""
		})
	}

	const handleLogin = async () => {
		try {
			const response = await loginMutation(userData);

			dispatch(
				setUser({
					id: response.data.id,
					email_id: response.data.email_id,
					role: response.data.role,
					token: response.data.token,
				})
			);

			localStorage.setItem("token", response.data.token);

			toast.success(response.message || "User logged in successfully!")
			navigate("/")

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

			toast.error(error.response?.data?.message || "Login failed.");
		}
	}

	return (
		<Card className="w-80 md:w-120 rounded-md gap-0">
			<CardHeader className="pb-3">
				<CardTitle>Login</CardTitle>
				<CardDescription>Login to your account</CardDescription>
			</CardHeader>

			<CardContent className="border-t pt-5 pb-3 flex flex-col gap-3 justify-center">
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

				<Button
					onClick={handleLogin}
					disabled={isPending}
					className="w-fit mx-auto px-6 cursor-pointer"
				>
					{isPending ? "Logging In..." : "Log In"}
				</Button>

			</CardContent>

			<CardFooter className="flex justify-center">
				<p>
					Not a User?{" "}
					<Link
						to="/auth/register"
						className="text-blue-500 hover:underline"
					>
						Register
					</Link>
				</p>
			</CardFooter>
		</Card>
	);
};