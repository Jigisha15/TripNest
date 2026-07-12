import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { formatDate } from "../../utils/formateDate";
import { useGetUser } from "../../api/user/user-mutation";

interface ViewAgencyUserDetailsInterface {
	owner_id: string
}

export const ViewAgencyUserDetails = ({ owner_id }: ViewAgencyUserDetailsInterface) => {
	if (!owner_id) {
		return null;
	}

	const { data, isLoading, error } = useGetUser({
		user_id: owner_id!
	})

	if (isLoading) {
		return (
			<div className="flex h-[70vh] items-center justify-center">
				Loading...
			</div>
		);
	}

	if (error || !owner_id) {
		return (
			<div className="flex h-[70vh] items-center justify-center">
				Something went wrong.
			</div>
		);
	}

	const agency_user = data.data[0];

	return (
		<div className="space-y-8 px-5 w-full">
			<div className="grid grid-cols-1 gap-4 mt-4">
				<div className="border-b pb-5">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center pb-5">
						<div className="space-y-2 w-full">
							<Label>First Name</Label>
							<Input
								type="text"
								name="first_name"
								value={agency_user.first_name}
								readOnly
							/>
						</div>

						<div className="space-y-2 w-full">
							<Label>Last Name</Label>
							<Input
								type="text"
								name="last_name"
								value={agency_user.last_name}
								readOnly
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center">
						<div className="space-y-2">
							<Label>Email Id</Label>
							<Input
								type="email"
								name="email_id"
								value={agency_user.email_id}
								readOnly
							/>
						</div>

						<div className="space-y-2">
							<Label>Phone Number</Label>
							<Input
								type="phone"
								name="phone_number"
								value={agency_user.phone_number}
								readOnly
							/>
						</div>
					</div>
				</div>

				<div className="border-b py-4">
					<div className="space-y-2 pb-5">
						<Label>Role</Label>
						<Input
							name="role"
							value={agency_user.role}
							readOnly
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center">
						<div className="space-y-2">
							<Label>Created At</Label>
							<Input
								type="text"
								name="created_at"
								value={formatDate(agency_user.created_at)}
								readOnly
							/>
						</div>

						<div className="space-y-2">
							<Label>Updated At</Label>
							<Input
								type="text"
								name="updated_at"
								value={formatDate(agency_user.updated_at)}
								readOnly
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}