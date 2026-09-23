import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useCreateItinerary, useUpdateItinerary } from "../../api/itinerary/itinerary-mutation";
import { Spinner } from "../ui/spinner";

interface ItineraryItem {
	id?: string;
	title: string;
	description: string;
}

interface DaySection {
	id?: string;
	type: "DAY";
	day_number: number;
	title: string;
	description: string;
	items: ItineraryItem[];
}

interface NightSection {
	id?: string;
	type: "NIGHT";
	night_number: number;
	title: string;
	description: string;
	items: ItineraryItem[];
}

//id?: string;
type ItinerarySection = DaySection | NightSection;

type SectionChanges = {
	title?: string;
	description?: string;
};

interface CiPageInterface {
	trip_id: string;
	duration_days: number;
	duration_nights: number;
	setOpenCreate?: React.Dispatch<React.SetStateAction<boolean>>;
	setOpenUpdate?: React.Dispatch<React.SetStateAction<boolean>>;
	mode: "CREATE" | "UPDATE";
	initialData?: ItinerarySection[];
}

export const Ci = ({
	trip_id,
	duration_days,
	duration_nights,
	setOpenCreate,
	setOpenUpdate,
	mode,
	initialData,
}: CiPageInterface) => {

	// initial data - state
	const [formData, setFormData] = useState<{
		trip_id: string;
		itineraries: ItinerarySection[];
	}>({
		trip_id,

		itineraries:
			mode === "UPDATE" && initialData
				? initialData
				: [
					{
						type: "DAY",
						day_number: 1,
						title: "",
						description: "",
						items: [
							{
								title: "",
								description: "",
							},
						],
					},

					{
						type: "NIGHT",
						night_number: 1,
						title: "",
						description: "",
						items: [
							{
								title: "",
								description: "",
							},
						],
					},
				],
	});

	const { mutateAsync: createItineraryMutation, isPending: isCreating, } = useCreateItinerary();

	const { mutateAsync: updateItineraryMutation, isPending: isUpdating, } = useUpdateItinerary();

	// create empty day initially
	const createEmptyDay = (dayNumber: number): DaySection => ({
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

	// create empty night initially
	const createEmptyNight = (nightNumber: number): NightSection => ({
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

	// get next day number without exceeding max number
	const getNextDayNumber = () => {
		const dayNumbers = formData.itineraries
			.filter(
				(section): section is DaySection =>
					section.type === "DAY"
			)
			.map((section) => section.day_number);

		return dayNumbers.length > 0
			? Math.max(...dayNumbers) + 1
			: 1;
	};

	// get next night number without exceeding max number
	const getNextNightNumber = () => {
		const nightNumbers = formData.itineraries
			.filter(
				(section): section is NightSection =>
					section.type === "NIGHT"
			)
			.map((section) => section.night_number);

		return nightNumbers.length > 0
			? Math.max(...nightNumbers) + 1
			: 1;
	};

	// add day
	const addDay = () => {
		console.log("formData : ", duration_days)
		const currentDays = formData.itineraries.filter(
			(section) => section.type === "DAY"
		).length;

		if (currentDays >= duration_days) {
			toast.error(
				`You can only add ${duration_days} day(s) for this trip.`
			);

			return;
		}

		const nextDay = getNextDayNumber();

		setFormData((prev) => ({
			...prev,

			itineraries: [
				...prev.itineraries,
				createEmptyDay(nextDay),
			],
		}));
	};

	// add night
	const addNight = () => {
		const currentNights = formData.itineraries.filter(
			(section) => section.type === "NIGHT"
		).length;

		if (currentNights >= duration_nights) {
			toast.error(
				`You can only add ${duration_nights} night(s) for this trip.`
			);

			return;
		}

		const nextNight = getNextNightNumber();

		setFormData((prev) => ({
			...prev,

			itineraries: [
				...prev.itineraries,
				createEmptyNight(nextNight),
			],
		}));
	};

	// remove day/night
	const removeSection = (sectionIndex: number) => {
		setFormData((prev) => ({
			...prev,

			itineraries: prev.itineraries.filter(
				(_, index) => index !== sectionIndex
			),
		}));
	};

	// change section
	const handleSectionChange = (index: number, changes: SectionChanges) => {
		setFormData((prev) => ({
			...prev,

			itineraries: prev.itineraries.map(
				(section, sectionIndex) =>
					sectionIndex === index
						? {
							...section,
							...changes,
						}
						: section
			),
		}));
	};

	// add inner item
	const addItem = (sectionIndex: number) => {
		setFormData((prev) => ({
			...prev,

			itineraries: prev.itineraries.map(
				(section, index) => {
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
				}
			),
		}));
	};

	// remove inner item
	const removeItem = (sectionIndex: number, itemIndex: number) => {
		setFormData((prev) => ({
			...prev,

			itineraries: prev.itineraries.map(
				(section, index) => {
					if (index !== sectionIndex) {
						return section;
					}

					return {
						...section,

						items: section.items.filter(
							(_, index) =>
								index !== itemIndex
						),
					};
				}
			),
		}));
	};

	// change a particular item
	const handleItemChange = (
		sectionIndex: number,
		itemIndex: number,
		field: keyof ItineraryItem,
		value: string
	) => {
		setFormData((prev) => ({
			...prev,

			itineraries: prev.itineraries.map(
				(section, index) => {
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
				}
			),
		}));
	};

	// validate itinerary
	const validateItinerary = () => {

		if (formData.itineraries.length === 0) {
			toast.error(
				"Please add at least one day or night."
			);

			return false;
		}

		const dayCount = formData.itineraries.filter(
			(section) => section.type === "DAY"
		).length;

		const nightCount = formData.itineraries.filter(
			(section) => section.type === "NIGHT"
		).length;

		// Safety check
		if (dayCount > duration_days) {
			toast.error(
				`Maximum ${duration_days} day(s) allowed.`
			);

			return false;
		}

		if (nightCount > duration_nights) {
			toast.error(
				`Maximum ${duration_nights} night(s) allowed.`
			);

			return false;
		}

		for (const section of formData.itineraries) {

			const sectionName =
				section.type === "DAY"
					? `Day ${section.day_number} `
					: `Night ${section.night_number} `;

			// Section title
			if (!section.title.trim()) {
				toast.error(
					`${sectionName} title is required.`
				);

				return false;
			}

			// At least one item
			if (section.items.length === 0) {
				toast.error(
					`${sectionName} must contain at least one item.`
				);

				return false;
			}

			// Check every item
			for (let i = 0; i < section.items.length; i++) {

				const item = section.items[i];

				if (!item.title.trim()) {
					toast.error(
						`${sectionName}: Item ${i + 1} title is required.`
					);

					return false;
				}
			}
		}

		return true;
	};

	// submit function
	//const handleSubmit = async (e: React.FormEvent) => {
	//	e.preventDefault();

	//	if (!validateItinerary()) {
	//		return;
	//	}

	//	try {

	//		await createItineraryMutation(formData)
	//		setOpenCreate(false);
	//		toast.success("Itinerary created successfully");

	//	} catch (error) {
	//		console.error("Create itinerary error:", error);
	//		toast.error("Something went wrong.");
	//	}
	//};
	const handleSubmit = async (
		e: React.FormEvent
	) => {
		e.preventDefault();

		if (!validateItinerary()) {
			return;
		}

		try {

			// ---------------- CREATE ----------------

			if (mode === "CREATE") {

				await createItineraryMutation({
					trip_id,
					itineraries: formData.itineraries,
				});
				setOpenCreate?.(false);

				toast.success(
					"Itinerary created successfully"
				);

			}

			// ---------------- UPDATE ----------------
			else {
				const updateData = {
					itineraries: formData.itineraries.map((section) => {
						const base = {
							id: section.id,
							type: section.type,
							title: section.title,
							description: section.description,
							items: section.items.map((item) => ({
								id: item.id,
								title: item.title,
								description: item.description,
							})),
						};

						if (section.type === "DAY") {
							return {
								...base,
								day_number: section.day_number,
							};
						}

						return {
							...base,
							night_number: section.night_number,
						};
					}),
				};

				await updateItineraryMutation({
					trip_id,
					updateData
				});
				setOpenUpdate?.(false);

				toast.success(
					"Itinerary updated successfully"
				);
			}


		} catch (error) {

			console.error(
				"Itinerary operation error:",
				error
			);

			toast.error(
				mode === "CREATE"
					? "Error while creating itinerary"
					: "Error while updating itinerary"
			);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-6 p-5">

			{/* ADD DAY / NIGHT */}
			<div className="flex gap-3">
				<Button
					type="button"
					variant="outline"
					onClick={addDay}
					disabled={
						formData.itineraries.filter(
							(section) =>
								section.type === "DAY"
						).length >= duration_days
					}
				>
					<Plus />
					Add Day
				</Button>
				<Button
					type="button"
					variant="outline"
					onClick={addNight}
					disabled={
						formData.itineraries.filter(
							(section) =>
								section.type === "NIGHT"
						).length >= duration_nights
					}
				>
					<Plus />
					Add Night
				</Button>
			</div>

			{/* SECTIONS */}
			{formData.itineraries.map(
				(section, sectionIndex) => {

					const isDay =
						section.type === "DAY";

					const number = isDay
						? section.day_number
						: section.night_number;

					return (
						<div
							key={`${section.type} -${number} `}
							className="border rounded-lg p-4 space-y-5"
						>

							{/* SECTION HEADER */}

							<div className="flex items-center justify-between">

								<h2 className="text-lg font-semibold">
									{isDay
										? `Day ${number} `
										: `Night ${number} `}
								</h2>

								<Button
									type="button"
									variant="destructive"
									size="icon"
									onClick={() =>
										removeSection(
											sectionIndex
										)
									}
								>
									<Trash2 />
								</Button>

							</div>

							{/* SECTION TITLE */}

							<div className="space-y-2">

								<label className="text-sm font-medium">
									Title
								</label>

								<Input
									value={section.title}
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
									placeholder={
										isDay
											? `Day ${number} title`
											: `Night ${number} title`
									}
								/>

							</div>

							{/* SECTION DESCRIPTION */}

							<div className="space-y-2">

								<label className="text-sm font-medium">
									Description
								</label>

								<Textarea
									value={
										section.description
									}
									onChange={(e) =>
										handleSectionChange(
											sectionIndex,
											{
												description:
													e
														.target
														.value,
											}
										)
									}
									placeholder="Description..."
								/>

							</div>

							{/* ITEMS */}

							<div className="space-y-4">

								<div className="flex items-center justify-between">

									<h3 className="font-medium">
										Itinerary Items
									</h3>

									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() =>
											addItem(
												sectionIndex
											)
										}
									>
										<Plus />
										Add Item
									</Button>

								</div>

								{section.items.map(
									(item, itemIndex) => (

										<div
											key={itemIndex}
											className="border rounded-md p-4 space-y-3"
										>

											<div className="flex items-center justify-between">

												<span className="text-sm font-medium">
													Item{" "}
													{itemIndex +
														1}
												</span>

												<Button
													type="button"
													variant="ghost"
													size="icon"
													onClick={() =>
														removeItem(
															sectionIndex,
															itemIndex
														)
													}
													disabled={
														section
															.items
															.length ===
														1
													}
												>
													<Trash2 />
												</Button>

											</div>

											<Input
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
												placeholder="Item title"
											/>

											<Textarea
												value={
													item.description
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
												placeholder="Item description..."
											/>

										</div>

									)
								)}

							</div>

						</div>
					);
				}
			)}

			{/* SUBMIT */}
			<Button
				type="submit"
				disabled={isCreating || isUpdating}
			>
				{isCreating || isUpdating ? (
					<>
						<Spinner />
						{mode === "CREATE"
							? "Creating..."
							: "Updating..."}
					</>
				) : (
					<>
						{mode === "CREATE"
							? "Create Itinerary"
							: "Update Itinerary"}
					</>
				)}
			</Button>

		</form>
	);
};