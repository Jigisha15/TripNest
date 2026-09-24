import { useState, type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import type { GetTripInterface, UpdateTripInterface } from "../../interfaces/trips.interface";
import { formatDate } from "../../utils/formateDate";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useDeleteTrip, useUpdateTrip } from "../../api/trips/trips-mutation";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { CalendarIcon, Save, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { useNavigate } from "react-router-dom";


interface ViewTripDetailsProps {
	trip: GetTripInterface | null;
	agency_name: string,
	setUpdateFlag: Dispatch<SetStateAction<boolean>>;
	updateFlag: boolean | null;
	setDeleteFlag: Dispatch<SetStateAction<boolean>>;
	deleteFlag: boolean | null;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

export const ViewTripDetails = ({ trip, agency_name, setUpdateFlag, updateFlag, setDeleteFlag, deleteFlag, setOpen }: ViewTripDetailsProps) => {

	if (!trip) return null;

	const navigate = useNavigate();

	const [formData, setFormData] = useState(trip)
	const [errors, setErrors] = useState<Record<string, string>>({});

	// update api
	const { mutateAsync: updateTripMutation, isPending: isPendingU } = useUpdateTrip()

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
		setFormData(trip)
		setUpdateFlag(false)
		setDeleteFlag(false)
		setOpen(false)
	}

	const handleUpdateTrip = async () => {
		try {
			// check if there are changes, to avoid unnecessary update request in the db
			const hasChanges =
				formData.title !== trip.title ||
				formData.slug !== trip.slug ||
				formData.short_description !== trip.short_description ||
				formData.description !== trip.description ||
				formData.destination !== trip.destination ||
				formData.meeting_point !== trip.meeting_point ||
				formData.duration_days !== trip.duration_days ||
				formData.duration_nights !== trip.duration_nights ||
				formData.price !== trip.price ||
				formData.discount_price !== trip.discount_price ||
				formData.total_seats !== trip.total_seats ||
				formData.available_seats !== trip.available_seats ||
				formData.start_date !== trip.start_date ||
				formData.end_date !== trip.end_date ||
				formData.booking_deadline !== trip.booking_deadline ||
				formData.average_rating !== trip.average_rating ||
				formData.total_reviews !== trip.total_reviews ||
				formData.is_active !== trip.is_active;

			if (!hasChanges) {
				toast.success("No changes to save");
				resetForm();
				return;
			}

			const updateData: Partial<UpdateTripInterface> = {
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
				is_active: formData.is_active,
			}

			await updateTripMutation({
				trip_id: trip.id,
				updateData: updateData,
			})

			toast.success(`Trip details updated successfully!`)
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
	const { mutateAsync: deleteTripMutation, isPending: isPendingD } = useDeleteTrip()

	const handleDeleteTrip = async () => {
		try {
			if (!trip.id) return;

			await deleteTripMutation(trip.id)
			resetForm()
			navigate(`/trips/${trip.agency_id}/${agency_name}`);

			toast.success(`Trip deleted permanently`)

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
								onClick={handleUpdateTrip}
								disabled={isPendingU}
							>
								{isPendingU ? (
									<><Spinner />Updating Trip...</>
								) : (
									<><Save />Update Trip</>
								)}
							</Button>
						)}

						{deleteFlag && (

							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button
										variant="destructive"
										className="cursor-pointer hover:no-underline"
										onClick={() => setDeleteFlag(true)}
									>
										<Trash2 />Delete Trip
									</Button>
								</AlertDialogTrigger>

								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Are you sure?
										</AlertDialogTitle>

										<AlertDialogDescription>
											{trip.title} and all the details related to it will be deleted permanently
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
											onClick={handleDeleteTrip}
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
				<div className="flex items-center justify-between border-b pb-2">
					<h3 className="text-lg font-semibold">
						Basic Information
					</h3>
					<Badge
						variant={trip.is_active ? "outline" : "destructive"}
						className={trip.is_active ? "border-green-300 bg-green-100 text-green-900 text-md p-3" : "border-red-300 bg-red-100 text-red-900 text-md p-3"}
					>
						{trip.is_active ? ("Active") : ("Inactive")}
					</Badge>
				</div>

				<div className="grid grid-cols-1 gap-4 mt-4">
					<div className="space-y-2">
						<Label>Title</Label>
						<div className="w-full">
							<Input
								type="text"
								name="title"
								value={formData.title}
								onChange={handleChange}
								readOnly={!updateFlag}
							/>
							{errors.title && (
								<p className="text-sm text-red-500 w-full">
									{errors.title}
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
						<Label>Short Description</Label>
						<div className="w-full">
							<Textarea
								name="short_description"
								value={formData.short_description}
								onChange={handleChange}
								readOnly={!updateFlag}
								rows={3}
							/>
							{errors.short_description && (
								<p className="text-sm text-red-500 w-full">
									{errors.short_description}
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
				</div>
			</div>

			{/* Trip Details */}
			<div>
				<h3 className="mb-4 text-lg font-semibold border-b pb-2">
					Trip Details
				</h3>

				<div className="grid grid-cols-2 gap-4">

					<div className="space-y-2">
						<Label>Destination</Label>
						<div className="w-full">
							<Input
								type="text"
								name="destination"
								value={formData.destination}
								onChange={handleChange}
								readOnly={!updateFlag}
							/>
							{errors.destination && (
								<p className="text-sm text-red-500 w-full">
									{errors.destination}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label>Meeting Point</Label>
						<div className="w-full">
							<Input
								type="text"
								name="meeting_point"
								value={formData.meeting_point}
								onChange={handleChange}
								readOnly={!updateFlag}
							/>
							{errors.meeting_point && (
								<p className="text-sm text-red-500 w-full">
									{errors.meeting_point}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label>Duration (Days)</Label>
						<div className="w-full">
							<Input
								type="text"
								name="duration_days"
								value={formData.duration_days}
								onChange={handleChange}
								readOnly={!updateFlag}
							/>
							{errors.duration_days && (
								<p className="text-sm text-red-500 w-full">
									{errors.duration_days}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label>Duration (Nights)</Label>
						<div className="w-full">
							<Input
								type="text"
								name="duration_nights"
								value={formData.duration_nights}
								onChange={handleChange}
								readOnly={!updateFlag}
							/>
							{errors.duration_nights && (
								<p className="text-sm text-red-500 w-full">
									{errors.duration_nights}
								</p>
							)}
						</div>
					</div>

				</div>
			</div>

			{/* Itinerary */}
			<div>
				<h3 className="mb-4 text-lg font-semibold border-b pb-2">
					View Itinerary
				</h3>
			</div>

			{/* Pricing */}
			<div>
				<h3 className="mb-4 text-lg font-semibold border-b pb-2">
					Pricing
				</h3>

				<div className="grid grid-cols-2 gap-4">

					<div className="space-y-2">
						<Label>Price</Label>
						<div className="w-full">
							<Input
								type="number"
								name="price"
								value={formData.price}
								//value={`₹ ${formData.price}`}
								onChange={handleChange}
								readOnly={!updateFlag}
							/>
							{errors.price && (
								<p className="text-sm text-red-500 w-full">
									{errors.price}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label>Discount Price</Label>
						<div className="w-full">
							<Input
								type="number"
								name="discount_price"
								value={formData.discount_price}
								//value={`₹ ${formData.price}`}
								onChange={handleChange}
								readOnly={!updateFlag}
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

			{/* Seats */}
			<div>
				<h3 className="mb-4 text-lg font-semibold border-b pb-2">
					Seats
				</h3>

				<div className="grid grid-cols-2 gap-4">

					<div className="space-y-2">
						<Label>Total Seats</Label>
						<div className="w-full">
							<Input
								type="number"
								min={0}
								name="total_seats"
								value={formData.total_seats}
								onChange={handleChange}
								readOnly={!updateFlag}
							/>
							{errors.total_seats && (
								<p className="text-sm text-red-500 w-full">
									{errors.total_seats}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label>Available Seats</Label>
						<div className="w-full">
							<Input
								type="number"
								min={0}
								name="available_seats"
								value={formData.available_seats}
								onChange={handleChange}
								readOnly={!updateFlag}
							/>
							{errors.available_seats && (
								<p className="text-sm text-red-500 w-full">
									{errors.available_seats}
								</p>
							)}
						</div>
					</div>

				</div>
			</div>

			{/* Dates */}
			<div>
				<h3 className="mb-4 text-lg font-semibold border-b pb-2">
					Dates
				</h3>

				<div className="grid grid-cols-2 gap-4">

					{/*<div className="space-y-2">
						<Label>Start Date</Label>
						<Input
							type="datetime-local"
							//value={formatDate(trip.start_date)}
							value={formData.start_date}
							readOnly
						/>
					</div>*/}
					<div className="space-y-2">
						<Label>Start Date</Label>

						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className="w-full justify-start text-left font-normal"
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{formData.start_date
										? format(formData.start_date, "PPP")
										: "Select a date"}
								</Button>
							</PopoverTrigger>

							<PopoverContent className="w-auto p-0">
								<Calendar
									mode="single"
									selected={formData.start_date as Date}
									onSelect={(date) => {
										if (!date) return;

										setFormData(prev => ({
											...prev,
											start_date: date,
										}));
									}}
								/>
							</PopoverContent>
						</Popover>
						{errors.start_date && (
							<p className="text-sm text-red-500 w-full">
								{errors.start_date}
							</p>
						)}
					</div>

					{/*<div className="space-y-2">
						<Label>End Date</Label>
						<Input value={formatDate(trip.end_date)} readOnly />
					</div>*/}
					<div className="space-y-2">
						<Label>End Date</Label>

						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className="w-full justify-start text-left font-normal"
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{formData.end_date
										? format(formData.end_date, "PPP")
										: "Select a date"}
								</Button>
							</PopoverTrigger>

							<PopoverContent className="w-auto p-0">
								<Calendar
									mode="single"
									selected={formData.end_date as Date}
									onSelect={(date) => {
										if (!date) return;

										setFormData(prev => ({
											...prev,
											end_date: date,
										}));
									}}
								/>
							</PopoverContent>
						</Popover>
						{errors.end_date && (
							<p className="text-sm text-red-500 w-full">
								{errors.end_date}
							</p>
						)}
					</div>

					{/*<div className="space-y-2 col-span-2">
						<Label>Booking Deadline</Label>
						<Input value={formatDate(trip.booking_deadline)} readOnly />
					</div>*/}
					<div className="space-y-2">
						<Label>Booking Deadline</Label>

						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className="w-full justify-start text-left font-normal"
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{formData.booking_deadline
										? format(formData.booking_deadline, "PPP")
										: "Select a date"}
								</Button>
							</PopoverTrigger>

							<PopoverContent className="w-auto p-0">
								<Calendar
									mode="single"
									selected={formData.booking_deadline as Date}
									onSelect={(date) => {
										if (!date) return;

										setFormData(prev => ({
											...prev,
											booking_deadline: date,
										}));
									}}
								/>
							</PopoverContent>
						</Popover>
						{errors.booking_deadline && (
							<p className="text-sm text-red-500 w-full">
								{errors.booking_deadline}
							</p>
						)}
					</div>

				</div>
			</div>

			{/* Ratings */}
			<div>
				<h3 className="mb-4 text-lg font-semibold border-b pb-2">
					Ratings
				</h3>

				<div className="grid grid-cols-2 gap-4">

					<div className="space-y-2">
						<Label>Average Rating</Label>
						<Input value={trip.average_rating} readOnly />
					</div>

					<div className="space-y-2">
						<Label>Total Reviews</Label>
						<Input value={trip.total_reviews} readOnly />
					</div>

				</div>
			</div>

			{/* Status */}
			<div>
				<h3 className="mb-4 text-lg font-semibold border-b pb-2">
					Agency Details
				</h3>

				<div className="grid grid-cols-1 gap-4">
					<div className="space-y-2">
						<Label>Agency</Label>
						<Input value={agency_name} readOnly />
					</div>

					<div className="flex items-center justify-center gap-4">
						<div className="space-y-2 w-full">
							<Label>Created At</Label>
							<Input value={formatDate(trip.created_at)} readOnly />
						</div>

						<div className="space-y-2 w-full">
							<Label>Updated At</Label>
							<Input value={formatDate(trip.updated_at)} readOnly />
						</div>
					</div>

				</div>
			</div>

		</div >
	);
};