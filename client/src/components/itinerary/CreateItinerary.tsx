import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateItinerary, useUpdateItinerary } from "../../api/itinerary/itinerary-mutation";
import toast from "react-hot-toast";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

interface ItineraryItem {
	id?: string;
	title: string;
	description?: string | null;
}

interface ItinerarySection {
	id?: string;
	type: "DAY" | "NIGHT";
	day_number?: number | null;
	night_number?: number | null;
	title: string;
	description?: string | null;
	items: ItineraryItem[];
}

interface CreateItineraryPageInterface {
	agency_id: string;
	agency_name: string;
	trip_id: string;
	openCreate: boolean;
	setOpenCreate: React.Dispatch<React.SetStateAction<boolean>>;
	numberOfDays: number;
	numberOfNights: number;

	// UPDATE MODE
	isUpdate?: boolean;
	existingItinerary?: ItinerarySection[];
}

// --------------------------------------------------
// EMPTY SECTION
// --------------------------------------------------

const createEmptyDay = (dayNumber: number): ItinerarySection => ({
	type: "DAY",
	day_number: dayNumber,
	title: "",
	description: "",
	items: [
		{
			title: "",
			description: "",
		},
	],
});

const createEmptyNight = (nightNumber: number): ItinerarySection => ({
	type: "NIGHT",
	night_number: nightNumber,
	title: "",
	description: "",
	items: [
		{
			title: "",
			description: "",
		},
	],
});

// --------------------------------------------------
// COMPONENT
// --------------------------------------------------

export const CreateItinerary = ({
	agency_id,
	agency_name,
	trip_id,
	trip_name,
	openCreate,
	setOpenCreate,
	numberOfDays,
	numberOfNights,
	isUpdate = false,
	existingItinerary,
}: CreateItineraryPageInterface) => {
	const navigate = useNavigate();

	// --------------------------------------------------
	// STATE
	// --------------------------------------------------

	const [itinerary, setItinerary] = useState<ItinerarySection[]>(
		isUpdate && existingItinerary
			? existingItinerary
			: [createEmptyDay(1)]
	);

	// --------------------------------------------------
	// LOAD EXISTING DATA IN UPDATE MODE
	// --------------------------------------------------

	useEffect(() => {
		if (isUpdate && existingItinerary) {
			setItinerary(existingItinerary);
		}

		if (!isUpdate) {
			setItinerary([createEmptyDay(1)]);
		}
	}, [isUpdate, existingItinerary]);

	// --------------------------------------------------
	// MUTATIONS
	// --------------------------------------------------

	const {
		mutateAsync: createItineraryMutation,
		isPending: createLoading,
	} = useCreateItinerary();

	const {
		mutateAsync: updateItineraryMutation,
		isPending: updateLoading,
	} = useUpdateItinerary();

	const isPending = createLoading || updateLoading;

	// --------------------------------------------------
	// RESET FORM
	// --------------------------------------------------

	const resetForm = () => {
		setItinerary([createEmptyDay(1)]);
		setOpenCreate(false);
	};

	// --------------------------------------------------
	// GET NEXT DAY NUMBER
	// --------------------------------------------------

	const getNextDayNumber = () => {
		const dayNumbers = itinerary
			.filter((section) => section.type === "DAY")
			.map((section) => section.day_number || 0);

		return dayNumbers.length > 0
			? Math.max(...dayNumbers) + 1
			: 1;
	};

	// --------------------------------------------------
	// GET NEXT NIGHT NUMBER
	// --------------------------------------------------

	const getNextNightNumber = () => {
		const nightNumbers = itinerary
			.filter((section) => section.type === "NIGHT")
			.map((section) => section.night_number || 0);

		return nightNumbers.length > 0
			? Math.max(...nightNumbers) + 1
			: 1;
	};

	// --------------------------------------------------
	// ADD DAY
	// --------------------------------------------------

	const addDay = () => {
		const nextDay = getNextDayNumber();

		setItinerary((prev) => [
			...prev,
			createEmptyDay(nextDay),
		]);
	};

	// --------------------------------------------------
	// ADD NIGHT
	// --------------------------------------------------

	const addNight = () => {
		const nextNight = getNextNightNumber();

		setItinerary((prev) => [
			...prev,
			createEmptyNight(nextNight),
		]);
	};

	// --------------------------------------------------
	// REMOVE SECTION
	// --------------------------------------------------

	const removeSection = (index: number) => {
		setItinerary((prev) =>
			prev.filter((_, sectionIndex) => sectionIndex !== index)
		);
	};

	// --------------------------------------------------
	// UPDATE SECTION
	// --------------------------------------------------

	const handleSectionChange = (
		index: number,
		changes: Partial<ItinerarySection>
	) => {
		setItinerary((prev) =>
			prev.map((section, sectionIndex) =>
				sectionIndex === index
					? {
						...section,
						...changes,
					}
					: section
			)
		);
	};

	// --------------------------------------------------
	// ADD ITEM
	// --------------------------------------------------

	const addItem = (sectionIndex: number) => {
		setItinerary((prev) =>
			prev.map((section, index) => {
				if (index !== sectionIndex) {
					return section;
				}

				return {
					...section,
					items: [
						...section.items,
						{
							title: "",
							description: "",
						},
					],
				};
			})
		);
	};

	// --------------------------------------------------
	// REMOVE ITEM
	// --------------------------------------------------

	const removeItem = (
		sectionIndex: number,
		itemIndex: number
	) => {
		setItinerary((prev) =>
			prev.map((section, index) => {
				if (index !== sectionIndex) {
					return section;
				}

				return {
					...section,
					items: section.items.filter(
						(_, index) => index !== itemIndex
					),
				};
			})
		);
	};

	// --------------------------------------------------
	// UPDATE ITEM
	// --------------------------------------------------

	const handleItemChange = (
		sectionIndex: number,
		itemIndex: number,
		field: keyof ItineraryItem,
		value: string
	) => {
		setItinerary((prev) =>
			prev.map((section, index) => {
				if (index !== sectionIndex) {
					return section;
				}

				return {
					...section,

					items: section.items.map(
						(item, index) =>
							index === itemIndex
								? {
									...item,
									[field]: value,
								}
								: item
					),
				};
			})
		);
	};

	// --------------------------------------------------
	// VALIDATION
	// --------------------------------------------------

	const validateItinerary = () => {
		if (itinerary.length === 0) {
			toast.error(
				"Please add at least one day or night."
			);

			return false;
		}

		for (const section of itinerary) {
			if (!section.title.trim()) {
				toast.error(
					`${section.type === "DAY"
						? "Day"
						: "Night"
					} title is required.`
				);

				return false;
			}

			if (section.items.length === 0) {
				toast.error(
					`${section.type === "DAY"
						? "Day"
						: "Night"
					} ${section.type === "DAY"
						? section.day_number
						: section.night_number
					} must contain at least one item.`
				);

				return false;
			}

			for (const item of section.items) {
				if (!item.title.trim()) {
					toast.error(
						"Every itinerary item must have a title."
					);

					return false;
				}
			}
		}

		return true;
	};

	// --------------------------------------------------
	// UPDATE PAYLOAD
	// --------------------------------------------------

	const buildUpdatePayload = () => {
		return {
			itineraries: itinerary.map((section) => ({
				...(section.id
					? {
						id: section.id,
					}
					: {}),

				type: section.type,

				...(section.type === "DAY"
					? {
						day_number: section.day_number,
					}
					: {
						night_number: section.night_number,
					}),

				title: section.title,

				description:
					section.description ?? "",

				items: section.items.map((item) => ({
					...(item.id
						? {
							id: item.id,
						}
						: {}),

					title: item.title,

					description:
						item.description ?? "",
				})),
			})),
		};
	};

	// --------------------------------------------------
	// CREATE PAYLOAD
	// --------------------------------------------------

	const buildCreatePayload = () => {
		return itinerary.map((section) => ({
			type: section.type,

			...(section.type === "DAY"
				? {
					day_number: section.day_number,
				}
				: {
					night_number: section.night_number,
				}),

			title: section.title,

			description:
				section.description ?? "",

			items: section.items.map((item) => ({
				title: item.title,

				description:
					item.description ?? "",
			})),
		}));
	};

	// --------------------------------------------------
	// SUBMIT
	// --------------------------------------------------

	const handleSubmit = async () => {
		if (!validateItinerary()) {
			return;
		}

		try {
			// ==========================================
			// UPDATE
			// ==========================================

			if (isUpdate) {
				const updateData =
					buildUpdatePayload();

				console.log(
					"UPDATE PAYLOAD:",
					updateData
				);

				await updateItineraryMutation({
					trip_id,
					updateData,
				});

				toast.success(
					"Itinerary updated successfully"
				);
			}

			// ==========================================
			// CREATE
			// ==========================================

			else {
				const createData =
					buildCreatePayload();

				console.log(
					"CREATE PAYLOAD:",
					createData
				);

				await createItineraryMutation({
					trip_id,
					itineraries: createData,
				});

				toast.success(
					"Itinerary created successfully"
				);
			}

			// ==========================================
			// AFTER SUCCESS
			// ==========================================

			setOpenCreate(false);

			navigate(
				`/itinerary/${agency_id}/${agency_name}/${trip_id}/${trip_name}`
			);

			resetForm();

		} catch (error: any) {
			console.error(
				"Itinerary submit error:",
				error
			);

			toast.error(
				error?.response?.data?.message ||
				error?.message ||
				`Failed to ${isUpdate
					? "update"
					: "create"
				} itinerary`
			);
		}
	};

	// --------------------------------------------------
	// CLOSE
	// --------------------------------------------------

	const handleClose = () => {
		resetForm();
	};

	// --------------------------------------------------
	// UI
	// --------------------------------------------------

	if (!openCreate) {
		return null;
	}

	return (
		<div className="container py-4">

			{/* ========================================
                HEADER
            ======================================== */}

			<div className="d-flex justify-content-between align-items-center mb-4">

				<div>
					<h2 className="mb-1">
						{isUpdate
							? "Update Itinerary"
							: "Create Itinerary"}
					</h2>

					<p className="text-muted mb-0">
						{isUpdate
							? "Update your trip itinerary."
							: "Plan your trip by adding days, nights and activities."}
					</p>
				</div>

				<button
					type="button"
					className="btn btn-outline-secondary"
					onClick={handleClose}
					disabled={isPending}
				>
					Cancel
				</button>

			</div>

			{/* ========================================
                ITINERARY SECTIONS
            ======================================== */}

			{itinerary.map((section, sectionIndex) => {

				const isDay =
					section.type === "DAY";

				return (
					<div
						key={
							section.id ??
							`${section.type}-${sectionIndex}`
						}
						className="card mb-4 shadow-sm"
					>

						{/* SECTION HEADER */}

						<div className="card-header d-flex justify-content-between align-items-center">

							<div>
								<strong>
									{isDay
										? `Day ${section.day_number}`
										: `Night ${section.night_number}`}
								</strong>
							</div>

							<button
								type="button"
								className="btn btn-sm btn-outline-danger"
								onClick={() =>
									removeSection(
										sectionIndex
									)
								}
								disabled={
									isPending ||
									itinerary.length === 1
								}
							>
								Remove
							</button>

						</div>

						{/* SECTION BODY */}

						<div className="card-body">

							{/* TITLE */}

							<div className="mb-3">

								<label className="form-label">
									{isDay
										? "Day Title"
										: "Night Title"}
								</label>

								<input
									type="text"
									className="form-control"
									placeholder={
										isDay
											? "Enter day title"
											: "Enter night title"
									}
									value={
										section.title
									}
									onChange={(e) =>
										handleSectionChange(
											sectionIndex,
											{
												title:
													e.target
														.value,
											}
										)
									}
									disabled={isPending}
								/>

							</div>

							{/* DESCRIPTION */}

							<div className="mb-4">

								<label className="form-label">
									Description
								</label>

								<textarea
									className="form-control"
									rows={3}
									placeholder="Enter description"
									value={
										section.description ??
										""
									}
									onChange={(e) =>
										handleSectionChange(
											sectionIndex,
											{
												description:
													e.target
														.value,
											}
										)
									}
									disabled={isPending}
								/>

							</div>

							{/* ITEMS */}

							<div>

								<div className="d-flex justify-content-between align-items-center mb-3">

									<h5 className="mb-0">
										Activities
									</h5>

									<button
										type="button"
										className="btn btn-sm btn-outline-primary"
										onClick={() =>
											addItem(
												sectionIndex
											)
										}
										disabled={
											isPending
										}
									>
										+ Add Activity
									</button>

								</div>

								{section.items.map(
									(
										item,
										itemIndex
									) => (
										<div
											key={
												item.id ??
												`${sectionIndex}-${itemIndex}`
											}
											className="border rounded p-3 mb-3"
										>

											{/* ITEM HEADER */}

											<div className="d-flex justify-content-between align-items-center mb-3">

												<strong>
													Activity{" "}
													{itemIndex +
														1}
												</strong>

												<button
													type="button"
													className="btn btn-sm btn-outline-danger"
													onClick={() =>
														removeItem(
															sectionIndex,
															itemIndex
														)
													}
													disabled={
														isPending ||
														section
															.items
															.length ===
														1
													}
												>
													Remove
												</button>

											</div>

											{/* ITEM TITLE */}

											<div className="mb-3">

												<label className="form-label">
													Activity Title
												</label>

												<input
													type="text"
													className="form-control"
													placeholder="Enter activity title"
													value={
														item.title
													}
													onChange={(
														e
													) =>
														handleItemChange(
															sectionIndex,
															itemIndex,
															"title",
															e
																.target
																.value
														)
													}
													disabled={
														isPending
													}
												/>

											</div>

											{/* ITEM DESCRIPTION */}

											<div>

												<label className="form-label">
													Activity Description
												</label>

												<textarea
													className="form-control"
													rows={2}
													placeholder="Enter activity description"
													value={
														item.description ??
														""
													}
													onChange={(
														e
													) =>
														handleItemChange(
															sectionIndex,
															itemIndex,
															"description",
															e
																.target
																.value
														)
													}
													disabled={
														isPending
													}
												/>

											</div>

										</div>
									)
								)}

							</div>

						</div>

					</div>
				);
			})}

			{/* ========================================
                ADD DAY / NIGHT
            ======================================== */}

			<div className="d-flex gap-2 mb-4">

				<button
					type="button"
					className="btn btn-outline-primary"
					onClick={addDay}
					disabled={isPending}
				>
					+ Add Day
				</button>

				<button
					type="button"
					className="btn btn-outline-primary"
					onClick={addNight}
					disabled={isPending}
				>
					+ Add Night
				</button>

			</div>

			{/* ========================================
                SUBMIT
            ======================================== */}

			<div className="d-flex justify-content-end gap-2">

				<button
					type="button"
					className="btn btn-secondary"
					onClick={handleClose}
					disabled={isPending}
				>
					Cancel
				</button>

				<button
					type="button"
					className="btn btn-primary"
					onClick={handleSubmit}
					disabled={isPending}
				>
					{isPending
						? isUpdate
							? "Updating..."
							: "Creating..."
						: isUpdate
							? "Update Itinerary"
							: "Create Itinerary"}
				</button>

			</div>

		</div>
	);
};