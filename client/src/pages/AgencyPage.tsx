import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import type { GetAgencyInterface } from "../interfaces/agency.interface";
import { useGetAgency } from "../api/agency/agency-mutation";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/ui/sheet";
import { CreateAgency } from "../components/agency-page/CreateAgency";
import { Agencies } from "../components/agency-page/Agencies";

export interface AgencyDataInterface {
	data: GetAgencyInterface[]
}

export const AgencyPage = () => {

	const user = useSelector((state: RootState) => state.auth.user);

	const [openCreate, setOpenCreate] = useState<boolean>(false)

	let agencyData: AgencyDataInterface;
	let loadingState: boolean;
	let err;

	if (user?.role === "AGENCY_USER") {
		const { data, isLoading, error } = useGetAgency({
			user_id: user?.id,
		});
		agencyData = data;
		loadingState = isLoading;
		err = error;
	} else {
		const { data, isLoading, error } = useGetAgency();
		agencyData = data;
		loadingState = isLoading;
		err = error;
	}

	if (loadingState) {
		return (
			<div className="flex h-[70vh] items-center justify-center">
				Loading...
			</div>
		);
	}

	if (err) {
		return (
			<div className="flex h-[70vh] items-center justify-center">
				Something went wrong.
			</div>
		);
	}

	if (!agencyData?.data?.length) {
		return (
			<div className="flex items-center justify-center">
				No Agencies Exist
			</div>
		)
	}

	return (
		<div className="mx-auto max-w-6xl px-4 py-10 flex items-center justify-center gap-5 flex-col">
			{
				user?.role === "AGENCY_USER" ? (
					<>
						<div className="flex items-center justify-end w-full">
							<Button
								className="cursor-pointer"
								variant="outline"
								onClick={() => {
									setOpenCreate(true)
								}}
							>
								<Plus />Create Agency
							</Button>
						</div>
						{/*<AgencyUserData data={agencyData?.data} />*/}
						<Agencies data={agencyData.data} />
					</>
				) : (
					//<AgencyTable />
					<Agencies data={agencyData?.data} />
				)
			}

			{/*  CREATE THE AGENCY */}
			<Sheet open={openCreate} onOpenChange={setOpenCreate}>
				<SheetContent className="w-full! sm:max-w-xl! lg:max-w-2xl! overflow-y-auto">
					<SheetHeader>
						<SheetTitle>Create agency</SheetTitle>
					</SheetHeader>

					<CreateAgency
						owner_id={user?.id!}
						setOpenCreate={setOpenCreate}
					/>
				</SheetContent>
			</Sheet>
		</div >
	)
}