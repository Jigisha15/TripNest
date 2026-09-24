import { Card, CardContent, CardHeader } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { ArrowUpRight, Eye, Save, SquarePen, Trash2, X } from "lucide-react"
import { Badge } from "../ui/badge"
import { formatDate } from "../../utils/formateDate"
import { Link, useNavigate } from "react-router-dom"
import type { GetAgencyInterface, UpdateAgencyData } from "../../interfaces/agency.interface"
import { Button } from "../ui/button"
import { useState, type ChangeEvent } from "react"
import { toast } from "react-hot-toast"
import { useDeleteAgency, useUpdateAgency } from "../../api/agency/agency-mutation"
import { Spinner } from "../ui/spinner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { Switch } from "../ui/switch"
import { Textarea } from "../ui/textarea"

export interface AgencyUserDataInterface {
	data: GetAgencyInterface[]
}

export const AgencyUserData = (agency: AgencyUserDataInterface) => {

	const navigate = useNavigate();

	const [formData, setFormData] = useState<UpdateAgencyData>()
	const [errors, setErrors] = useState<Record<string, string>>({});

	const [editingAgencyId, setEditingAgencyId] = useState<string | null>(null);
	const [selectedAgency, setSelectedAgency] = useState<string>("")

	//const [updateFlag, setUpdateFlag] = useState<boolean>(false)
	const [deleteFlag, setDeleteFlag] = useState<boolean>(false)


	// handle change
	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name } = e.target;

		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
		setErrors(prev => ({
			...prev,
			[name]: "",
		}));
	}

	// reset function
	const resetForm = () => {
		setFormData({
			name: formData?.name,
			slug: formData?.slug,
			description: formData?.description,
			email_id: formData?.email_id,
			phone_number: formData?.phone_number,
			password: formData?.password,
			website: formData?.website,
			address: formData?.address,
			city: formData?.city,
			state: formData?.state,
			country: formData?.country,
			is_active: formData?.is_active,
			user_id: formData?.user_id,
		})

		//setUpdateFlag(false)
		setDeleteFlag(false)
		setEditingAgencyId("")
		setSelectedAgency("")
		setErrors({})
	}

	// update api
	const { mutateAsync: updateAgencyMutation, isPending: isPendingU } = useUpdateAgency()

	// handle update
	const handleUpdateAgency = async (agcy: UpdateAgencyData) => {
		try {
			// check if there are changes, to avoid unnecessary update request in the db
			const hasChanges =
				formData?.name !== agcy.name ||
				formData?.slug !== agcy.slug ||
				formData?.description !== agcy.description ||
				formData?.email_id !== agcy.email_id ||
				formData?.phone_number !== agcy.phone_number ||
				formData?.website !== agcy.website ||
				formData?.address !== agcy.address ||
				formData?.city !== agcy.city ||
				formData?.state !== agcy.state ||
				formData?.country !== agcy.country ||
				formData?.is_active !== agcy.is_active;

			if (!hasChanges) {
				toast.success("No changes to save");
				resetForm();
				return;
			}
			const updateData: Partial<UpdateAgencyData> = {
				name: formData?.name,
				slug: formData?.slug,
				description: formData?.description,
				email_id: formData?.email_id,
				phone_number: formData?.phone_number,
				website: formData?.website,
				address: formData?.address,
				city: formData?.city,
				country: formData?.country,
				state: formData?.state,
				is_active: formData?.is_active,
			}

			await updateAgencyMutation({
				agency_id: selectedAgency,
				updateData: updateData,
			})

			toast.success(`Agency details updated successfully!`)
			resetForm();

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
	const { mutateAsync: deleteAgencyMutation, isPending: isPendingD } = useDeleteAgency()

	// handle delete
	const handleDeleteAgency = async () => {
		try {
			if (!selectedAgency) return;

			await deleteAgencyMutation(selectedAgency)
			resetForm()
			navigate("/agency");

			toast.success(`Agency deleted permanently`)

		} catch (error: any) {
			console.error("Error while deleting agency : ", error)
			toast.error("Error while deleting agency : ", error)
		}
	}

	return (
		<>
			{agency.data.map((ad) => {

				const agencyImage =
					ad.logo ||
					"https://ui-avatars.com/api/?name=" +
					encodeURIComponent(`${ad.name}`) +
					"&background=2563eb&color=fff&size=256";

				const createdDate = formatDate(ad.created_at)
				const updatedDate = formatDate(ad.updated_at)

				return (
					<Card
						key={ad.id}
						className="overflow-hidden rounded-2xl shadow-lg py-0 w-full"
					>
						<CardHeader className="border-b bg-linear-to-r flex gap-4 py-4 items-center justify-end">
							{editingAgencyId === ad.id ? (
								<div className="flex gap-4">
									<Button
										className="w-fit cursor-pointer"
										variant="outline"
										onClick={() => {
											//setUpdateFlag(false);
											setEditingAgencyId("");
											setSelectedAgency("");
											setFormData(undefined);
											setErrors({})
										}}
									>
										<X /> Cancel
									</Button>
									<Button
										className="w-fit cursor-pointer"
										variant="outline"
										onClick={() => {
											handleUpdateAgency(ad)
										}}
									>
										{isPendingU ? (
											<><Spinner />Updating Agency...</>
										) : (
											<><Save />Update Agency</>
										)}
									</Button>
								</div>
							) : (
								<div className="">
									<Button
										className="w-fit cursor-pointer"
										variant="outline"
										onClick={() => {
											//setUpdateFlag(true);
											setEditingAgencyId(ad.id);
											setSelectedAgency(ad.id);
											setFormData(ad);
										}}
									>
										<SquarePen /> Edit Agency
									</Button>
								</div>
							)}

							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button
										variant="destructive"
										className="cursor-pointer hover:no-underline"
										onClick={() => {
											setDeleteFlag(true);
											setSelectedAgency(ad.id);
											setFormData(ad);
										}}
									>
										<Trash2 />Delete Agency
									</Button>
								</AlertDialogTrigger>

								{deleteFlag && (
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Are you sure?
											</AlertDialogTitle>

											<AlertDialogDescription>
												{formData?.name} and all the details related to it will be deleted permanently
											</AlertDialogDescription>
										</AlertDialogHeader>

										<AlertDialogFooter>
											<AlertDialogCancel
												variant={undefined}
												size={undefined}
												className="cursor-pointer"
												onClick={() => setDeleteFlag(false)}
											>
												Cancel
											</AlertDialogCancel>

											<AlertDialogAction
												onClick={handleDeleteAgency}
												variant="destructive"
												size={undefined}
												className="cursor-pointer"
											>
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
								)}
							</AlertDialog>

							<Link
								className="w-fit cursor-pointer flex items-center gap-1 border rounded-md px-2 py-1 font-medium"
								to={`/trips/${ad.id}/${ad.name}`}
							>
								<Eye size={19} /> View Trips
							</Link>
						</CardHeader>

						<CardContent className="grid gap-10 p-8 md:grid-cols-[260px_1fr]">
							{/* Left Section */}
							<div className="flex flex-col items-center justify-start">

								<div className="px-5 w-full flex items-center justify-end">
									{editingAgencyId === ad.id ? (
										<div className="flex items-center gap-2 mb-2">
											<Switch
												checked={formData?.is_active ?? false}
												onCheckedChange={(checked) =>
													setFormData((prev) =>
														prev
															? {
																...prev,
																is_active: checked,
															}
															: prev
													)
												}
												className="
        											cursor-pointer
        											data-[state=checked]:bg-green-500
        											data-[state=checked]:border-green-600
        											data-[state=unchecked]:bg-red-500
        											data-[state=unchecked]:border-red-600
    											"
												size="default"
											/>
											<span className="text-sm font-medium">
												{formData?.is_active ? "Active" : "Inactive"}
											</span>
										</div>
									) : (
										<Badge
											variant={ad.is_active ? "outline" : "destructive"}
											className={ad.is_active ? "border-green-300 bg-green-100 text-green-900" : "border-red-300 bg-red-100 text-red-900"}
										>
											{ad.is_active ? ("Active") : ("Inactive")}
										</Badge>
									)}
								</div>

								<img
									src={agencyImage}
									alt="Profile"
									className="h-48 w-48 rounded-full border-4 border-blue-100 object-cover shadow-md"
								/>

								<div className="flex gap-0 items-center justify-center flex-col">
									<h2 className="mt-6 text-2xl font-bold tracking-tight">
										{ad.name}
									</h2>

									{editingAgencyId === ad.id ? (
										<div className="mt-4 w-full">
											<div className="space-y-2 w-full">
												<Label>Website</Label>
												<div className="w-full">
													<Input
														className="w-full"
														type="url"
														name="website"
														value={
															editingAgencyId === ad.id
																? formData?.website ?? ""
																: ad.website
														}
														onChange={handleChange}
														readOnly={editingAgencyId !== ad.id}
													/>
													{errors.website && (
														<p className="text-sm text-red-500 w-full">
															{errors.website}
														</p>
													)}
												</div>
											</div>
										</div>
									) : (
										<>
											{ad.website ? (

												<Link
													to={ad.website}
													target="_blank"
													className="group mt-2 flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
												>
													{ad.website}
													<ArrowUpRight
														size={15}
														className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
													/>
												</Link>
											) : (
												<div className=""></div>
											)}
										</>
									)}

									<div className="mt-6 space-y-4">
										<div className="flex items-center gap-0">
											<Label htmlFor="created_at" className="w-30 shrink-0">
												Created At
											</Label>
											<Input
												id="created_at"
												name="created_at"
												value={createdDate}
												readOnly
											/>
										</div>

										<div className="flex items-center gap-0">
											<Label htmlFor="updated_at" className="w-30 shrink-0">
												Updated At
											</Label>
											<Input
												id="updated_at"
												name="updated_at"
												value={updatedDate}
												readOnly
											/>
										</div>
									</div>
								</div>
							</div>

							{/* Right Section */}
							<div className="">
								<div className="grid gap-6 md:grid-cols-2 mb-5">
									<div className="space-y-2">
										<Label>Slug</Label>
										<div className="w-full">
											{/*<Input
												type="text"
												name="slug"
												value={
													editingAgencyId === ad.id
														? formData?.slug ?? ""
														: ad.slug
												}
												onChange={handleChange}
												readOnly={editingAgencyId !== ad.id}
											/>*/}
											<Textarea
												name="slug"
												value={
													editingAgencyId === ad.id
														? formData?.slug ?? ""
														: ad.slug
												}
												onChange={handleChange}
												readOnly={editingAgencyId !== ad.id}
												rows={3}
											/>
											{errors.slug && (
												<p className="text-sm text-red-500 w-full">
													{errors.slug}
												</p>
											)}
										</div>
									</div>

									<div className="space-y-2">
										<Label>Description</Label>
										<div className="w-full">
											<Textarea
												name="description"
												value={
													editingAgencyId === ad.id
														? formData?.description ?? ""
														: ad.description
												}
												onChange={handleChange}
												readOnly={editingAgencyId !== ad.id}
												rows={3}
											/>
											{errors.description && (
												<p className="text-sm text-red-500 w-full">
													{errors.description}
												</p>
											)}
										</div>
										{/*<p className="mt-0 leading-7 text-muted-foreground">
											{ad.description}
										</p>*/}
									</div>
								</div>

								<div className="grid gap-6 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Name</Label>
										<Input
											type="text"
											name="name"
											value={
												editingAgencyId === ad.id
													? formData?.name ?? ""
													: ad.name
											}
											onChange={handleChange}
											readOnly={editingAgencyId !== ad.id}
										/>
									</div>

									<div className="space-y-2">
										<Label>Email Address</Label>
										<Input
											type="email"
											name="email_id"
											value={
												editingAgencyId === ad.id
													? formData?.email_id ?? ""
													: ad.email_id
											}
											onChange={handleChange}
											readOnly={editingAgencyId !== ad.id}
										/>
									</div>

									<div className="space-y-2">
										<Label>Phone Number</Label>
										<Input
											type="tel"
											name="phone_number"
											value={
												editingAgencyId === ad.id
													? formData?.phone_number ?? ""
													: ad.phone_number
											}
											onChange={handleChange}
											readOnly={editingAgencyId !== ad.id}
										/>
									</div>

									<div className="space-y-2">
										<Label>Address</Label>
										<Input
											type="text"
											name="address"
											value={
												editingAgencyId === ad.id
													? formData?.address ?? ""
													: ad.address
											}
											onChange={handleChange}
											readOnly={editingAgencyId !== ad.id}
										/>
									</div>

								</div>

								<div className="flex flex-col">
									<div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
										<div className="space-y-2">
											<Label>City</Label>
											<Input
												type="text"
												name="city"
												value={
													editingAgencyId === ad.id
														? formData?.city ?? ""
														: ad.city
												}
												onChange={handleChange}
												readOnly={editingAgencyId !== ad.id}
											/>
										</div>

										<div className="space-y-2">
											<Label>State</Label>
											<Input
												type="text"
												name="state"
												value={
													editingAgencyId === ad.id
														? formData?.state ?? ""
														: ad.state
												}
												onChange={handleChange}
												readOnly={editingAgencyId !== ad.id}
											/>
										</div>

										<div className="space-y-2">
											<Label>Country</Label>
											<Input
												type="text"
												name="country"
												value={
													editingAgencyId === ad.id
														? formData?.country ?? ""
														: ad.country
												}
												onChange={handleChange}
												readOnly={editingAgencyId !== ad.id}
											/>
										</div>
									</div>

									{editingAgencyId === ad.id && (
										<div className="mt-4">
											<div className="space-y-2">
												<Label>Password</Label>
												<Input
													type="password"
													name="password"
													value={
														editingAgencyId === ad.id
															? formData?.password ?? ""
															: ad.password
													}
													onChange={handleChange}
													readOnly={editingAgencyId !== ad.id}
												/>
											</div>
										</div>
									)}
								</div>
							</div>
						</CardContent>
					</Card >
				)
			})}
		</>
	)
}