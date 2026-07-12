import { useState, type ChangeEvent, type Dispatch, type SetStateAction } from "react"
import type { CreateAgencyInterface } from "../../interfaces/agency.interface"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { useCreateAgency } from "../../api/agency/agency-mutation"
import toast from "react-hot-toast"
import { Spinner } from "../ui/spinner"
import { SaveCheck } from "lucide-react"

interface CreateAgencyPageInterface {
	owner_id: string;
	setOpenCreate: Dispatch<SetStateAction<boolean>>
}

export const CreateAgency = ({ owner_id, setOpenCreate }: CreateAgencyPageInterface) => {

	const [formData, setFormData] = useState<CreateAgencyInterface>({
		name: "",
		slug: "",
		description: "",
		email_id: "",
		phone_number: "",
		password: "",
		website: "",
		address: "",
		city: "",
		state: "",
		country: "",
		is_active: false,
		user_id: ""
	})
	const [errors, setErrors] = useState<Record<string, string>>({});

	// create api
	const { mutateAsync: createAgencyMutation, isPending: isPending } = useCreateAgency()

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

	// reset form
	const resetForm = () => {
		setFormData({
			name: "",
			slug: "",
			description: "",
			email_id: "",
			phone_number: "",
			password: "",
			website: "",
			address: "",
			city: "",
			state: "",
			country: "",
			is_active: false,
			user_id: ""
		})
		setOpenCreate(false)
	}

	// handlesubmit
	const handleCreateAgency = async () => {
		try {
			// prepare payload
			const payload = {
				name: formData.name,
				slug: formData.slug,
				description: formData.description,
				email_id: formData.email_id,
				phone_number: formData.phone_number,
				password: formData.password,
				website: formData.website,
				address: formData.address,
				city: formData.city,
				state: formData.state,
				country: formData.country,
				is_active: formData.is_active,
				user_id: owner_id
			}

			//const response = await createAgencyMutation({
			//	//data: payload,
			//	name: formData.name,
			//	slug: formData.slug,
			//	description: formData.description,
			//	email_id: formData.email_id,
			//	phone_number: formData.phone_number,
			//	password: formData.password,
			//	website: formData.website,
			//	address: formData.address,
			//	city: formData.city,
			//	state: formData.state,
			//	country: formData.country,
			//	is_active: formData.is_active,
			//	user_id: owner_id
			//});

			await createAgencyMutation(payload)

			// toast
			toast.success("Agency created successfully!")
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

			toast.error(error.response?.data?.message || "Agency creation failed.");
		}
	}

	return (
		<div className="space-y-8 px-5 w-full">
			<div className="grid grid-cols-1 gap-4 mt-4">
				<div className="space-y-2 w-full">
					<Label>Name<span className="text-red-600">*</span></Label>
					<div className="w-full">
						<Input
							type="text"
							name="name"
							onChange={handleChange}
							value={formData?.name}
							required
						/>
						{errors.name && (
							<p className="text-sm text-red-500 w-full">
								{errors.name}
							</p>
						)}
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center pb-5">
					<div className="space-y-2 w-full">
						<Label>Slug</Label>
						<div className="w-full">
							<Textarea
								value={formData?.slug}
								name="slug"
								onChange={handleChange}
								rows={3}
							/>
							{errors.slug && (
								<p className="text-sm text-red-500 w-full">
									{errors.slug}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2 w-full">
						<Label>Description</Label>
						<div className="w-full">
							<Textarea
								value={formData?.description}
								name="description"
								onChange={handleChange}
								rows={3}
							/>
							{errors.description && (
								<p className="text-sm text-red-500 w-full">
									{errors.description}
								</p>
							)}
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center pb-5">
					<div className="space-y-2">
						<Label className="">Email Id <span className="text-red-600">*</span></Label>
						<div className="w-full">
							<Input
								type="email"
								name="email_id"
								onChange={handleChange}
								value={formData?.email_id}
								required
							/>
							{errors.email_id && (
								<p className="text-sm text-red-500 w-full">
									{errors.email_id}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label>Phone Number<span className="text-red-600">*</span></Label>
						<div className="w-full">
							<Input
								type="phone"
								name="phone_number"
								onChange={handleChange}
								value={formData?.phone_number}
								required
							/>
							{errors.phone_number && (
								<p className="text-sm text-red-500 w-full">
									{errors.phone_number}
								</p>
							)}
						</div>
					</div>
				</div>


				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center pb-5">
					<div className="space-y-2">
						<Label>Password<span className="text-red-600">*</span></Label>
						<div className="w-full">
							<Input
								type="password"
								name="password"
								onChange={handleChange}
								value={formData?.password}
								required
							/>
							{errors.password && (
								<p className="text-sm text-red-500 w-full">
									{errors.password}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label>Website</Label>
						<div className="w-full">
							<Input
								type="url"
								name="website"
								onChange={handleChange}
								value={formData?.website}
							/>
							{errors.website && (
								<p className="text-sm text-red-500 w-full">
									{errors.website}
								</p>
							)}
						</div>
					</div>
				</div>

				<div className="space-y-2">
					<Label>Address<span className="text-red-600">*</span></Label>
					<div className="w-full">
						<Input
							type="text"
							name="address"
							onChange={handleChange}
							value={formData?.address}
							required
						/>
						{errors.address && (
							<p className="text-sm text-red-500 w-full">
								{errors.address}
							</p>
						)}
					</div>
				</div>


				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center justify-center pb-5">
					<div className="space-y-2">
						<Label>City<span className="text-red-600">*</span></Label>
						<div className="w-full">
							<Input
								type="text"
								name="city"
								onChange={handleChange}
								value={formData?.city}
								required
							/>
							{errors.city && (
								<p className="text-sm text-red-500 w-full">
									{errors.city}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label>State<span className="text-red-600">*</span></Label>
						<div className="w-full">
							<Input
								type="text"
								name="state"
								onChange={handleChange}
								value={formData?.state}
								required
							/>
							{errors.state && (
								<p className="text-sm text-red-500 w-full">
									{errors.state}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label>Country<span className="text-red-600">*</span></Label>
						<div className="w-full">
							<Input
								type="text"
								name="country"
								onChange={handleChange}
								value={formData?.country}
								required
							/>
							{errors.country && (
								<p className="text-sm text-red-500 w-full">
									{errors.country}
								</p>
							)}
						</div>
					</div>
				</div>

				<div className="flex items-center justify-center">
					<Button
						variant="outline"
						className="cursor-pointer"
						onClick={handleCreateAgency}
					>
						{
							isPending ? (
								<><Spinner />Creating...</>
							) : (
								<><SaveCheck />Create</>
							)
						}
					</Button>
				</div>
			</div>
		</div >
	)
}