import { Save, SquarePen, Trash2, X } from "lucide-react"
import type { GetUserInterface, UpdateUserData } from "../../interfaces/user.inteface"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useEffect, useState, type ChangeEvent } from "react"
import { useDeleteUser, useUpdateUser } from "../../api/user/user-mutation"
import { useSelector } from "react-redux"
import type { RootState } from "../../app/store"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { Spinner } from "../ui/spinner"

interface GetUserDataInterface {
	profile: GetUserInterface,
	profileImage: string
}

export const UserData = ({ profile, profileImage }: GetUserDataInterface) => {

	const navigate = useNavigate();

	const user = useSelector((state: RootState) => state.auth.user);

	const [updateFlag, setUpdateFlag] = useState<boolean>(false)
	const [deleteFlag, setDeleteFlag] = useState<boolean>(false)

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [formData, setFormData] = useState(profile)

	const handleUpdateFlag = () => {
		if (updateFlag) {
			setFormData(profile);
		}

		setUpdateFlag(!updateFlag);
	};

	const handleDeleteFlag = () => {
		setDeleteFlag(!deleteFlag);
	};

	const resetForm = () => {
		setUpdateFlag(false)
	}

	// update api
	const { mutateAsync: updateUserMutation, isPending: isPendingU } = useUpdateUser()

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
		setErrors(prev => ({
			...prev,
			[name]: "",
		}));
	}

	//const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	//	const file = e.target.files?.[0];

	//	if (!file) return;

	//	setFormData({
	//		...formData,
	//		profile_image: file,
	//	});
	//};

	const handleUpdateUser = async () => {
		try {
			const updateData: Partial<UpdateUserData> = {
				first_name: formData.first_name,
				last_name: formData.last_name,
				email_id: formData.email_id,
				phone_number: formData.phone_number,
				//profile_image: formData.profile_image as File,
			}

			await updateUserMutation({
				user_id: user?.id!,
				updateData: updateData,
			})

			toast.success(`User details updated successfully!`)

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

			toast.error(error.response?.data?.message || "Update failed.");
		}
	}

	// delete api
	const { mutateAsync: deleteUserMutation, isPending: isPendingD } = useDeleteUser()

	const handleDeleteUser = async () => {
		try {
			if (!user?.id) return

			await deleteUserMutation(user.id)

			localStorage.removeItem("token");
			navigate("/auth");

			toast.success(`User deleted permanently`)

		} catch (error: any) {
			console.error("Error while deleting user : ", error)
			toast.error("Error while deleting user : ", error)
		}
	}

	useEffect(() => {
		setFormData(profile);
	}, [profile]);

	return (
		<Card className="overflow-hidden rounded-2xl shadow-lg py-0 w-full">
			<CardHeader className="border-b bg-slate-50 py-4">
				<CardTitle className="text-2xl font-bold">
					My Profile
				</CardTitle>
			</CardHeader>

			<div className="flex gap-4 items-center justify-end px-5">
				{updateFlag && (
					<Button
						variant="outline"
						className="cursor-pointer"
						onClick={handleUpdateUser}
						disabled={isPendingU}
					>
						{isPendingU ? (
							<><Spinner />Saving...</>
						) : (
							<><Save />Save</>
						)}
					</Button>
				)}

				<Button
					variant="outline"
					className="cursor-pointer"
					onClick={handleUpdateFlag}
				>
					{updateFlag ? (
						<><X /> Cancel</>
					) : (
						<><SquarePen /> Update Profile</>
					)}
				</Button>

				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button
							variant="destructive"
							className="cursor-pointer hover:no-underline"
						>
							Delete Profile
						</Button>
					</AlertDialogTrigger>

					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								Are you sure?
							</AlertDialogTitle>

							<AlertDialogDescription>
								Your account and the related details will be deleted permanently
							</AlertDialogDescription>
						</AlertDialogHeader>

						<AlertDialogFooter>
							<AlertDialogCancel variant={undefined} size={undefined} className="cursor-pointer">
								Cancel
							</AlertDialogCancel>

							<AlertDialogAction onClick={handleDeleteUser} variant="destructive" size={undefined} className="cursor-pointer">
								{
									isPendingD ? (
										<><Spinner />Deleting...</>
									) : (
										<><Trash2 /> Delete</>
									)
								}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>

			<CardContent className="grid gap-10 p-8 md:grid-cols-[260px_1fr]">
				{/* Left Section */}
				<div className="flex flex-col items-center">
					<div className="flex flex-col items-center gap-4">
						<img
							src={profileImage}
							alt="Profile"
							className="h-48 w-48 rounded-full border-4 border-blue-100 object-cover shadow-md"
						/>

						{/*{updateFlag && (
							<>
								<input
									ref={fileInputRef}
									type="file"
									accept="image/*"
									className="hidden"
									onChange={handleImageChange}
								/>

								<Button
									type="button"
									variant="outline"
									onClick={() => fileInputRef.current?.click()}
								>
									Change Photo
								</Button>
							</>
						)}*/}
					</div>

					<h2 className="mt-5 text-xl font-semibold">
						{profile.first_name} {profile.last_name}
					</h2>

					<p className="mt-1 text-sm text-muted-foreground">
						{profile.role}
					</p>
				</div>

				{/* Right Section */}
				<div className="grid gap-6 md:grid-cols-2">
					<div className="space-y-2">
						<Label>First Name</Label>
						<div className="w-full">
							<Input
								className="w-full"
								type="text"
								name="first_name"
								value={formData.first_name}
								readOnly={!updateFlag}
								onChange={handleChange}
							/>
							{errors.first_name && (
								<p className="text-sm text-red-500 w-full">
									{errors.first_name}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label>Last Name</Label>
						<div className="w-full">
							<Input
								className="w-full"
								type="text"
								name="last_name"
								value={formData.last_name}
								readOnly={!updateFlag}
								onChange={handleChange}
							/>
							{errors.last_name && (
								<p className="text-sm text-red-500 w-full">
									{errors.last_name}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label>Email Address</Label>
						<div className="w-full">
							<Input
								className="w-full"
								type="email"
								name="email_id"
								value={formData.email_id}
								readOnly={!updateFlag}
								onChange={handleChange}
							/>
							{errors.email_id && (
								<p className="text-sm text-red-500 w-full">
									{errors.email_id}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label>Phone Number</Label>
						<div className="w-full">
							<Input
								className="w-full"
								type="texr"
								name="phone_number"
								value={formData.phone_number}
								readOnly={!updateFlag}
								onChange={handleChange}
							/>
							{errors.phone_number && (
								<p className="text-sm text-red-500 w-full">
									{errors.phone_number}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2 md:col-span-2">
						<Label>Role</Label>
						<Input
							name="role"
							value={profile.role}
							readOnly={!updateFlag}
							onChange={handleChange}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}