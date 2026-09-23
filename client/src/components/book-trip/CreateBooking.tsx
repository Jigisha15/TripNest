"use client"

import { useState, type ChangeEvent } from "react"
import type { CretaeBookingInterface } from "../../interfaces/booking.interface"
import { useCreateBooking } from "../../api/booking/booking-mutation"
import toast from "react-hot-toast"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Spinner } from "../ui/spinner"
import { SaveCheck } from "lucide-react"
import { Button } from "../ui/button"

interface CreateBookingPageInterface {
	trip_id: string,
	user_id: string
}

export const CreateBooking = ({ trip_id, user_id }: CreateBookingPageInterface) => {

	const [formData, setFormData] = useState<CretaeBookingInterface>({
		booking_status: "",
		special_request: "",
		payment_status: "",
		total_amount: 0,
		trip_id: "",
		user_id: ""
	})
	const [errors, setErrors] = useState<Record<string, string>>({});

	// create api
	const { mutateAsync: createBookingMutation, isPending: isPending } = useCreateBooking()

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
			booking_status: "",
			special_request: "",
			payment_status: "",
			total_amount: 0,
			trip_id: "",
			user_id: ""
		})
		setErrors({})
	}

	// hnadle submit
	const handleCreateBooking = async () => {
		try {
			// create payload
			const payload = {
				//booking_status: formData.booking_status,
				booking_status: "PENDING",
				payment_status: "PENDING",
				special_request: formData.special_request,
				total_amount: formData.total_amount,
				trip_id: trip_id,
				user_id: user_id
			}

			await createBookingMutation(payload)

			// toast
			toast.success("Booking created successfully!")
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

			toast.error(error.response?.data?.message || "Booking creation failed.");
		}
	}

	return (
		<div className="space-y-8 px-0 w-full">
			<div className="grid grid-cols-1 gap-4 mt-4">

				<div className="space-y-2 w-full">
					<Label>Special Request<span className="text-red-600">*</span></Label>
					<div className="w-full">
						<Input
							type="text"
							name="special_request"
							onChange={handleChange}
							value={formData?.special_request}
							required
						/>
						{errors.special_request && (
							<p className="text-sm text-red-500 w-full">
								{errors.special_request}
							</p>
						)}
					</div>
				</div>

				<div className="flex items-center justify-center">
					<Button
						variant="outline"
						className="cursor-pointer"
						onClick={handleCreateBooking}
					>
						{
							isPending ? (
								<><Spinner />Booking...</>
							) : (
								<><SaveCheck />Book</>
							)
						}
					</Button>
				</div>

			</div>
		</div>
	)
}


//enum BOOKING_STATUS {
//	PENDING
//  CONFIRMED
//  CANCEL_REQUESTED
//  CANCELLED
//  COMPLETED
//  REJECTED
//}

//enum PAYMENT_STATUS {
//	PENDING
//  PARTIAL_PAID
//  PAID
//  PARTIAL_REFUNDED
//  REFUNDED
//}

//enum CANCELLATION_STATUS {
//	PENDING
//  APPROVED
//  REJECTED
//}
