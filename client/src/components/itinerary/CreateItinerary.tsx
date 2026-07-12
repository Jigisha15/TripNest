import { useState, type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import type { CreateItineraryInterface, CreateItineraryItemInterface } from "../../interfaces/itinerary.interface";
import { useCreateItinerary } from "../../api/itinerary/itinerary-mutation";
import toast from "react-hot-toast";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useNavigate } from "react-router-dom";

interface CreateItineraryPageInterface {
	agency_id: string;
	trip_id: string;
	openCreate: boolean;
	setOpenCreate: Dispatch<SetStateAction<boolean>>
}

export const CreateItinerary = ({ agency_id, trip_id, openCreate, setOpenCreate }: CreateItineraryPageInterface) => {

	const navigate = useNavigate()

	const [itinerary, setItinerary] = useState<CreateItineraryItemInterface[]>([
		{
			day_number: "1",
			title: "",
			description: "",
		},
	]);

	const [errors, setErrors] = useState<Record<string, string>>({});

	// create api
	const { mutateAsync: createItineraryMutation, isPending: isPending } = useCreateItinerary()

	// reset form
	const resetForm = () => {
		setItinerary([
			{
				day_number: "1",
				title: "",
				description: "",
			},
		]);

		setErrors({});
		setOpenCreate(false);
	};

	// add day
	const addDay = () => {
		setItinerary(prev => [
			...prev,
			{
				day_number: String(prev.length + 1),
				title: "",
				description: "",
			},
		]);
	};

	// remove day
	const removeDay = (index: number) => {
		setItinerary(prev => prev.filter((_, i) => i !== index));
	};

	// handle change
	const handleChange = (
		index: number,
		field: keyof CreateItineraryItemInterface,
		value: string
	) => {
		setItinerary(prev =>
			prev.map((item, i) =>
				i === index
					? {
						...item,
						[field]: value,
					}
					: item
			)
		);
	};

	// handle submit
	const handleSubmit = async () => {
		try {
			await createItineraryMutation({
				trip_id,
				itineraries: itinerary,
			});

			toast.success("Itinerary created successfully");
			navigate(`/itinerary/${agency_id}/${trip_id}`)
			resetForm();
		} catch (error) {
			toast.error("Failed to create itinerary");
		}
	};

	return (
		<div className="px-5">
			{itinerary.map((item, index) => (
				<Card
					key={index}
					className="mb-6 space-y-4 border p-4"
				>
					<Label>Day Number</Label>
					<Input
						type="number"
						min={1}
						value={item.day_number}
						onChange={(e) =>
							handleChange(index, "day_number", e.target.value)
						}
					/>

					<Label>Title</Label>
					<Input
						value={item.title}
						onChange={(e) =>
							handleChange(index, "title", e.target.value)
						}
					/>

					<Label>Description</Label>
					<Textarea
						value={item.description}
						onChange={(e) =>
							handleChange(index, "description", e.target.value)
						}
					/>

					<div className="flex gap-5">
						<Button
							type="button"
							variant="outline"
							onClick={addDay}
						>
							Add Day
						</Button>
						<Button
							type="button"
							variant="destructive"
							disabled={itinerary.length === 1}
							onClick={() => removeDay(index)}
						>
							Remove
						</Button>
					</div>
				</Card>
			))}
			<Button
				type="button"
				variant="destructive"
				onClick={handleSubmit}
			>
				Submit
			</Button>
		</div>
	)
}