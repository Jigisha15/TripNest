import { useState, type ChangeEvent, type Dispatch, type SetStateAction } from "react"
import type { CreateTripInterface } from "../../interfaces/trips.interface"
import { useCreateTrip } from "../../api/trips/trips-mutation"
import toast from "react-hot-toast"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Spinner } from "../ui/spinner"
import { Button } from "../ui/button"
import { SaveCheck } from "lucide-react"

interface CreateTripPageInterface {
	agency_id: string,
	setOpenCreate: Dispatch<SetStateAction<boolean>>
}

export const CreateTrip = ({ agency_id, setOpenCreate }: CreateTripPageInterface) => {
	const [formData, setFormData] = useState<CreateTripInterface>({
		title: "",
		slug: "",
		short_description: "",
		description: "",
		destination: "",
		meeting_point: "",
		duration_days: 0,
		duration_nights: 0,
		price: 0,
		discount_price: 0,
		total_seats: 0,
		start_date: "",
		end_date: "",
		booking_deadline: "",
		is_active: false,
		agency_id: "",
	})
	const [errors, setErrors] = useState<Record<string, string>>({});


	// create api
	const { mutateAsync: createTripMutation, isPending: isPending } = useCreateTrip()

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
			title: "",
			slug: "",
			short_description: "",
			description: "",
			destination: "",
			meeting_point: "",
			duration_days: 0,
			duration_nights: 0,
			price: 0,
			discount_price: 0,
			total_seats: 0,
			start_date: "",
			end_date: "",
			booking_deadline: "",
			is_active: false,
			agency_id: "",
		})
		setOpenCreate(false)
	}

	// handlesubmit
	const handleCreateAgency = async () => {
		try {
			// prepare payload
			const payload = {
				title: formData.title,
				slug: formData.slug,
				short_description: formData.short_description,
				description: formData.description,
				destination: formData.destination,
				meeting_point: formData.meeting_point,
				duration_days: formData.duration_days,
				duration_nights: formData.duration_nights,
				price: formData.price,
				discount_price: formData.discount_price,
				total_seats: formData.total_seats,
				start_date: formData.start_date,
				end_date: formData.end_date,
				booking_deadline: formData.booking_deadline,
				is_active: true,
				agency_id: agency_id
			}

			await createTripMutation(payload);

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

				<div className="border-b">
					<div className="space-y-2 w-full">
						<Label>Title<span className="text-red-600">*</span></Label>
						<div className="w-full">
							<Input
								type="text"
								name="title"
								onChange={handleChange}
								value={formData?.title}
								required
							/>
							{errors.title && (
								<p className="text-sm text-red-500 w-full">
									{errors.title}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2 w-full mt-4">
						<Label>Short Description<span className="text-red-600">*</span></Label>
						<div className="w-full">
							<Input
								type="text"
								name="short_description"
								onChange={handleChange}
								value={formData?.short_description}
								required
							/>
							{errors.short_description && (
								<p className="text-sm text-red-500 w-full">
									{errors.short_description}
								</p>
							)}
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center pb-5 mt-4">

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
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center pb-5 border-b">

					<div className="space-y-2 w-full">
						<Label>Destination</Label>
						<div className="w-full">
							<Input
								type="text"
								name="destination"
								value={formData?.destination}
								onChange={handleChange}
							/>
							{errors.destination && (
								<p className="text-sm text-red-500 w-full">
									{errors.destination}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2 w-full">
						<Label>Meeting Point</Label>
						<div className="w-full">
							<Input
								type="text"
								name="meeting_point"
								value={formData?.meeting_point}
								onChange={handleChange}
							/>
							{errors.meeting_point && (
								<p className="text-sm text-red-500 w-full">
									{errors.meeting_point}
								</p>
							)}
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start justify-center pb-5 border-b">

					<div className="">
						<div className="space-y-2 w-full flex gap-5">
							<Label className="w-full">Duration Days</Label>
							<div className="w-full">
								<Input
									type="number"
									name="duration_days"
									value={formData?.duration_days}
									onChange={handleChange}
								/>
								{errors.duration_days && (
									<p className="text-sm text-red-500 w-full">
										{errors.duration_days}
									</p>
								)}
							</div>
						</div>

						<div className="space-y-2 w-full flex gap-5 mt-4">
							<Label className="w-full">Duration Nights</Label>
							<div className="w-full">
								<Input
									type="number"
									name="duration_nights"
									value={formData?.duration_nights}
									onChange={handleChange}
								/>
								{errors.duration_nights && (
									<p className="text-sm text-red-500 w-full">
										{errors.duration_nights}
									</p>
								)}
							</div>
						</div>

						<div className="space-y-2 w-full flex gap-5 mt-4">
							<Label className="w-full">Total Seats</Label>
							<div className="w-full">
								<Input
									type="number"
									name="total_seats"
									value={formData?.total_seats}
									onChange={handleChange}
								/>
								{errors.total_seats && (
									<p className="text-sm text-red-500 w-full">
										{errors.total_seats}
									</p>
								)}
							</div>
						</div>
					</div>

					<div className="flex flex-col">
						<div className="space-y-2 w-full flex gap-5">
							<Label className="w-full">Trip Price</Label>
							<div className="w-full">
								<Input
									type="number"
									name="price"
									value={formData?.price}
									onChange={handleChange}
								/>
								{errors.price && (
									<p className="text-sm text-red-500 w-full">
										{errors.price}
									</p>
								)}
							</div>
						</div>

						<div className="space-y-2 w-full flex gap-5 mt-4">
							<Label className="w-full">Discounted Price</Label>
							<div className="w-full">
								<Input
									type="number"
									name="discount_price"
									value={formData?.discount_price}
									onChange={handleChange}
								/>
								{errors.discount_price && (
									<p className="text-sm text-red-500 w-full">
										{errors.discount_price}
									</p>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center justify-center pb-5">
					<div className="space-y-2">
						<Label>Start Date<span className="text-red-600">*</span></Label>
						<div className="w-full">
							<Input
								type="datetime-local"
								name="start_date"
								onChange={handleChange}
								value={formData?.start_date as string}
								required
							/>
							{errors.start_date && (
								<p className="text-sm text-red-500 w-full">
									{errors.start_date}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label>End Date<span className="text-red-600">*</span></Label>
						<div className="w-full">
							<Input
								type="datetime-local"
								name="end_date"
								onChange={handleChange}
								value={formData?.end_date as string}
								required
							/>
							{errors.end_date && (
								<p className="text-sm text-red-500 w-full">
									{errors.end_date}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label>Booking Date<span className="text-red-600">*</span></Label>
						<div className="w-full">
							<Input
								type="datetime-local"
								name="booking_deadline"
								onChange={handleChange}
								value={formData?.booking_deadline as string}
								required
							/>
							{errors.booking_deadline && (
								<p className="text-sm text-red-500 w-full">
									{errors.booking_deadline}
								</p>
							)}
						</div>
					</div>
				</div>

				<div className="flex items-center justify-center mb-5">
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
		</div>
	)
}