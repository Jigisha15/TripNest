import { Request, Response } from "express"
import { prisma } from "../utils/prisma-client";
import { CreateCancellationValidation, UpdateCancellationValidation } from "../validations/cancellation.validation";

// get
export const getCancellation = async (req: Request, res: Response) => {
	const { id, booking_id, status } = req.query;

	try {

		const cancellations = await prisma.review.findMany({
			where: {
				...(id && {
					id: id as string,
				}),
				...(booking_id && {
					booking_id: booking_id as string,
				}),
				...(status && {
					status: status,
				}),
			},
		});

		// return response
		return res.status(200).json({
			success: true,
			message: cancellations.length > 0 ? "Data fetched successfully." : "No cancellations exist.",
			data: cancellations
		})

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error
		})
	}
};

// crete
export const createCancellation = async (
	req: Request,
	res: Response
) => {
	try {
		// Validate payload
		const { error, value } = CreateCancellationValidation.validate(req.body, {
			abortEarly: false,
		});

		if (error) {
			return res.status(400).json({
				success: false,
				message: "Invalid payload",
				error,
			});
		}

		// Create cancellation
		const cancellation = await prisma.cancellation.create({
			data: {
				status: value.status,
				payment_status: value.payment_status,
				cancelled_by: value.cancelled_by,
				cancellation_reason: value.cancellation_reason,
				cancelled_at: value.cancelled_at,
				refund_amount: value.refund_amount,
				refund_processed_at: value.refund_processed_at,
				booking_id: value.booking_id
			},
		});

		return res.status(201).json({
			success: true,
			message: "Cancellation created successfully.",
			data: cancellation,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error.",
			error,
		});
	}
};


// update
export const updateCancellation = async (
	req: Request,
	res: Response
) => {
	const cancellation_id = req.params.id;

	try {

		// Validate payload
		const { error, value } = UpdateCancellationValidation.validate(req.body, {
			abortEarly: false,
		});

		if (error) {
			return res.status(400).json({
				success: false,
				message: "Invalid payload",
				error,
			});
		}

		// Check if cancellation exists
		const existingCancellation = await prisma.cancellation.findUnique({
			where: {
				id: cancellation_id as string,
			},
		});

		if (!existingCancellation) {
			return res.status(404).json({
				success: false,
				message: "Cancellation not found.",
			});
		}

		// Update cancellation
		const updatedCancellation = await prisma.cancellation.update({
			where: {
				id: cancellation_id as string,
			},
			data: {
				status: value.status,
				payment_status: value.payment_status,
				cancelled_by: value.cancelled_by,
				cancellation_reason: value.cancellation_reason,
				cancelled_at: value.cancelled_at,
				refund_amount: value.refund_amount,
				refund_processed_at: value.refund_processed_at,
			},
		});

		return res.status(200).json({
			success: true,
			message: "Cancellation updated successfully.",
			data: updatedCancellation,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error.",
			error,
		});
	}
};

// delete
export const deleteCancellation = async (
	req: Request,
	res: Response
) => {
	const cancellation_id = req.params.id;

	try {

		// Check if cancellation exists
		const existingCancellation = await prisma.cancellation.findUnique({
			where: {
				id: cancellation_id as string,
			},
		});

		if (!existingCancellation) {
			return res.status(404).json({
				success: false,
				message: "Cancellation not found.",
			});
		}

		// Delete cancellation
		await prisma.cancellation.delete({
			where: {
				id: cancellation_id as string,
			},
		});

		return res.status(200).json({
			success: true,
			message: "Cancellation deleted successfully.",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error.",
			error,
		});
	}
};