import { useGetUser } from "../../api/user/user-mutation"
import { UserData } from "../profile-page/UserData";

interface AgencyUserIntergface {
	user_id: string
}

export const AgencyUser = ({ user_id }: AgencyUserIntergface) => {

	const { data, isLoading, error } = useGetUser({
		user_id: user_id
	})

	if (isLoading) {
		return (
			<div className="flex h-[70vh] items-center justify-center">
				Loading...
			</div>
		);
	}

	if (error || !user_id) {
		return (
			<div className="flex h-[70vh] items-center justify-center">
				Something went wrong.
			</div>
		);
	}

	const profileImage =
		data.profile_image ||
		"https://ui-avatars.com/api/?name=" +
		encodeURIComponent(`${data.first_name} ${data.last_name}`) +
		"&background=2563eb&color=fff&size=256";

	return (
		<UserData profile={data} profileImage={profileImage} />
	)
}