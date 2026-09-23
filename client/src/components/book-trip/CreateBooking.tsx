"use client"

import { useState, type ChangeEvent, type Dispatch, type SetStateAction } from "react"
import type { CretaeBookingInterface } from "../../interfaces/booking.interface"
import { useCreateBooking, useVerifyBookingPayment } from "../../api/booking/booking-mutation"
import toast from "react-hot-toast"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Spinner } from "../ui/spinner"
import { Check, SaveCheck } from "lucide-react"
import { Button } from "../ui/button"
import { useNavigate } from "react-router-dom"

interface CreateBookingPageInterface {
	trip_id: string,
	user_id: string,
	deadline_date: string,
	total_amount: number,
	check: boolean,
	setCheck: Dispatch<SetStateAction<boolean>>
}

export const CreateBooking = ({ trip_id, user_id, deadline_date, total_amount, check, setCheck }: CreateBookingPageInterface) => {

	const [formData, setFormData] = useState<CretaeBookingInterface>({
		special_request: "",
		total_amount: total_amount,
		trip_id: "",
		user_id: ""
	})
	const [errors, setErrors] = useState<Record<string, string>>({});

	const navigate = useNavigate();

	// create api
	const { mutateAsync: createBookingMutation, isPending: isPending } = useCreateBooking()

	// verify api
	const { mutateAsync: verifyPaymentMutation, } = useVerifyBookingPayment();

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
			special_request: "",
			total_amount: total_amount,
			trip_id: "",
			user_id: ""
		})
		setErrors({})
	}

	// handle submit
	const handleCreateBooking = async () => {
		try {
			const payload = {
				special_request: formData.special_request,
				total_amount: formData.total_amount,
				trip_id,
				user_id,
			};

			// create booking + razorpay order
			const response = await createBookingMutation(payload);

			const {
				booking_id,
				razorpay_order_id,
				amount,
				currency,
				razorpay_key,
			} = response.data;

			// open razorpay
			const options = {
				key: razorpay_key,
				amount,
				currency,
				name: "Your App Name",
				description: "Trip Booking",
				order_id: razorpay_order_id,

				handler: async (paymentResponse: any) => {

					try {

						//verify payment
						await verifyPaymentMutation({
							booking_id,
							razorpay_payment_id: paymentResponse.razorpay_payment_id,
							razorpay_order_id: paymentResponse.razorpay_order_id,
							razorpay_signature: paymentResponse.razorpay_signature,
						});

						toast.success("Payment successful! Booking confirmed.");
						navigate(`/bookings/${user_id}`)
						resetForm();
						setCheck(false);

					} catch (error: any) {

						toast.error(
							error.response?.data?.message ||
							"Payment verification failed."
						);
					}
				},

				theme: {
					color: "#000000",
				},
			};

			const razorpay = new window.Razorpay(options);

			razorpay.open();

		} catch (error: any) {

			if (error.response?.data?.error?.details) {

				const fieldErrors: Record<string, string> = {};

				error.response.data.error.details.forEach(
					(err: any) => {
						fieldErrors[err.path[0]] =
							err.message;
					}
				);

				setErrors(fieldErrors);

				toast.error(
					"Please fix the highlighted fields."
				);

				return;
			}

			toast.error(
				error.response?.data?.message ||
				"Booking creation failed."
			);
		}
	};

	return (
		<div className="space-y-8 px-0 w-full">
			<div className="grid grid-cols-1 gap-4 mt-2">

				<div className="space-y-2 w-full">
					<Label>Special Request</Label>
					<div className="w-full">
						<Input
							type="text"
							name="special_request"
							onChange={handleChange}
							value={formData?.special_request}
						/>
						{errors.special_request && (
							<p className="text-sm text-red-500 w-full">
								{errors.special_request}
							</p>
						)}
					</div>
				</div>

				<div className="flex gap-2 items-start justify-center text-justify">
					{check ? (
						<Button
							className="mt-0.5 w-5 h-5 bg-green-100 text-green-700 border-green-200 p-2 rounded-sm hover:bg-green-100"
							onClick={() => setCheck(false)}
						>
							<Check className="p-0 m-0" size={10} />
						</Button>
					) : (
						<Button
							variant="outline"
							className="mt-0.5 w-5 h-5 p-2 rounded-sm"
							onClick={() => setCheck(true)}
						></Button>
					)}
					<p>I acknowledge that the booking amount is non-refundable. I understand that my booking request may be withdrawn only before the specified withdrawal deadline - <span className="font-semibold">{deadline_date}</span>, after which cancellation or withdrawal will not be permitted.</p>
				</div>

				<div className="flex items-center justify-center">
					<Button
						variant="outline"
						className="cursor-pointer"
						onClick={handleCreateBooking}
						disabled={!check || isPending}
					>
						{isPending ? (
							<>
								<Spinner />
								Booking...
							</>
						) : (
							<>
								<SaveCheck />
								Book
							</>
						)}
					</Button>
				</div>

			</div>
		</div>
	)
}