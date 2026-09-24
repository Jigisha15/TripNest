import type { GetAgencyInterface, UpdateAgencyData } from "../../interfaces/agency.interface";
import { formatDate } from "../../utils/formateDate";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { ArrowUpRight, Save, Trash2 } from "lucide-react";
import { useDeleteAgency, useUpdateAgency } from "../../api/agency/agency-mutation";
import { useState, type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import toast from "react-hot-toast";
import { Spinner } from "../ui/spinner";
import { Link, useNavigate } from "react-router-dom";


interface ViewAgencyDetailsProps {
	agency: GetAgencyInterface | null;
	setUpdateFlag: Dispatch<SetStateAction<boolean>>;
	updateFlag: boolean | null;
	setDeleteFlag: Dispatch<SetStateAction<boolean>>;
	deleteFlag: boolean | null;
	setOpen: Dispatch<SetStateAction<boolean>>;
	//agency_name: string
}

export const ViewAgencyDetails = ({ agency, setUpdateFlag, updateFlag, setDeleteFlag, deleteFlag, setOpen }: ViewAgencyDetailsProps) => {

	if (!agency) return null;

	const navigate = useNavigate();

	const [formData, setFormData] = useState(agency)
	const [errors, setErrors] = useState<Record<string, string>>({});

	// update api
	const { mutateAsync: updateAgencyMutation, isPending: isPendingU } = useUpdateAgency()

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

	const resetForm = () => {
		setFormData(agency)
		setUpdateFlag(false)
		setDeleteFlag(false)
		setOpen(false)
	}

	const handleUpdateAgency = async () => {
		try {
			// check if there are changes, to avoid unnecessary update request in the db
			const hasChanges =
				formData.name !== agency.name ||
				formData.slug !== agency.slug ||
				formData.description !== agency.description ||
				formData.email_id !== agency.email_id ||
				formData.phone_number !== agency.phone_number ||
				formData.website !== agency.website ||
				formData.address !== agency.address ||
				formData.city !== agency.city ||
				formData.state !== agency.state ||
				formData.country !== agency.country ||
				formData.is_active !== agency.is_active;

			if (!hasChanges) {
				toast.success("No changes to save");
				resetForm();
				return;
			}

			const updateData: Partial<UpdateAgencyData> = {
				name: formData.name,
				slug: formData.slug,
				description: formData.description,
				email_id: formData.email_id,
				phone_number: formData.phone_number,
				website: formData.website,
				address: formData.address,
				city: formData.city,
				country: formData.country,
				state: formData.state,
				is_active: formData.is_active,
			}

			await updateAgencyMutation({
				agency_id: agency.id,
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

	const handleDeleteAgency = async () => {
		try {
			if (!agency.id) return;

			await deleteAgencyMutation(agency.id)
			resetForm()
			navigate("/agency");

			toast.success(`Agency deleted permanently`)

		} catch (error: any) {
			console.error("Error while deleting agency : ", error)
			toast.error("Error while deleting agency : ", error)
		}
	}

	return (
		<div className="space-y-8 py-4 px-5 w-full">
			{
				(updateFlag || deleteFlag) && (
					<div className="flex gap-4 items-center justify-end px-5">
						{updateFlag && (
							<Button
								variant="outline"
								className="cursor-pointer"
								onClick={handleUpdateAgency}
								disabled={isPendingU}
							>
								{isPendingU ? (
									<><Spinner />Updating Agency...</>
								) : (
									<><Save />Update Agency</>
								)}
							</Button>
						)}

						{deleteFlag && (
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button
										variant="destructive"
										className="cursor-pointer hover:no-underline"
									>
										<Trash2 />Delete Agency
									</Button>
								</AlertDialogTrigger>

								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Are you sure?
										</AlertDialogTitle>

										<AlertDialogDescription>
											{agency.name} and all the details related to it will be deleted permanently
										</AlertDialogDescription>
									</AlertDialogHeader>

									<AlertDialogFooter>
										<AlertDialogCancel
											variant={undefined}
											size={undefined}
											className="cursor-pointer"
											onClick={() => (setDeleteFlag(false))}
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
							</AlertDialog>
						)}
					</div>
				)
			}

			{/* Basic Information */}
			<div>
				<div className="flex items-center justify-between border-b  pb-2">
					<h3 className="text-lg font-semibold">
						Basic Information
					</h3>
					<div className="flex items-center justify-center gap-4">
						<Badge
							variant={agency.is_active ? "outline" : "destructive"}
							className={agency.is_active ? "border-green-300 bg-green-100 text-green-900 text-md p-3" : "border-red-300 bg-red-100 text-red-900 text-md p-3"}
						>
							{agency.is_active ? ("Active") : ("Inactive")}
						</Badge>
						{agency.website && (
							<Link
								to={agency.website}
								target="_blank"
								className="group flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline">
								Visit Site
								<ArrowUpRight
									size={15}
									className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
								/>
							</Link>
						)}
					</div>
				</div>

				<div className="grid grid-cols-1 gap-4 mt-4">
					<div className="space-y-2">
						<Label>Name</Label>
						<div className="w-full">
							<Input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleChange}
								readOnly={!updateFlag}
							/>
							{errors.name && (
								<p className="text-sm text-red-500 w-full">
									{errors.name}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label>Slug</Label>
						<div className="w-full">
							<Input
								type="text"
								name="slug"
								value={formData.slug}
								onChange={handleChange}
								readOnly={!updateFlag}
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
								value={formData.description}
								onChange={handleChange}
								readOnly={!updateFlag}
								rows={3}
							/>
							{errors.description && (
								<p className="text-sm text-red-500 w-full">
									{errors.description}
								</p>
							)}
						</div>
					</div>

					<div className="grid sm:grid-cols-1 md:grid-cols-2 sm: gap-3 md:gap-4">
						<div className="space-y-2 w-full">
							<Label>Email</Label>
							<div className="w-full">
								<Input
									type="email"
									name="email_id"
									value={formData.email_id}
									onChange={handleChange}
									readOnly={!updateFlag}
								/>
								{errors.email_id && (
									<p className="text-sm text-red-500 w-full">
										{errors.email_id}
									</p>
								)}
							</div>
						</div>

						<div className="space-y-2 w-full">
							<Label>Phone Number</Label>
							<div className="w-full">
								<Input
									type="text"
									name="phone_numebr"
									value={formData.phone_number}
									onChange={handleChange}
									readOnly={!updateFlag}
								/>
								{errors.phone_number && (
									<p className="text-sm text-red-500 w-full">
										{errors.phone_number}
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Address Details */}
			<div>
				<h3 className="mb-4 text-lg font-semibold border-b pb-2">
					Address Details
				</h3>

				<div className="grid grid-cols-2 gap-4">

					<div className="space-y-2">
						<Label>Address</Label>
						<div className="w-full">
							<Input
								type="text"
								name="address"
								value={formData.address}
								onChange={handleChange}
								readOnly={!updateFlag}
							/>
							{errors.address && (
								<p className="text-sm text-red-500 w-full">
									{errors.address}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label>City</Label>
						<div className="w-full">
							<Input
								type="text"
								name="city"
								value={formData.city}
								onChange={handleChange}
								readOnly={!updateFlag}
							/>
							{errors.city && (
								<p className="text-sm text-red-500 w-full">
									{errors.city}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label>State</Label>
						<div className="w-full">
							<Input
								type="text"
								name="state"
								value={formData.state}
								onChange={handleChange}
								readOnly={!updateFlag}
							/>
							{errors.state && (
								<p className="text-sm text-red-500 w-full">
									{errors.state}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label>Country</Label>
						<div className="w-full">
							<Input
								type="text"
								name="country"
								value={formData.country}
								onChange={handleChange}
								readOnly={!updateFlag}
							/>
							{errors.country && (
								<p className="text-sm text-red-500 w-full">
									{errors.country}
								</p>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Status */}
			<div>
				<h3 className="mb-4 text-lg font-semibold border-b pb-2">
					More Details
				</h3>

				<div className="flex items-center justify-center gap-4">
					<div className="space-y-2 w-full">
						<Label>Created At</Label>
						<Input value={formatDate(agency.created_at)} readOnly />
					</div>

					<div className="space-y-2 w-full">
						<Label>Updated At</Label>
						<Input value={formatDate(agency.updated_at)} readOnly />
					</div>

				</div>
			</div>

		</div>
	);
};