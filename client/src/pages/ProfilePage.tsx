import { useSelector } from "react-redux";
import { useGetUser } from "../api/user/user-mutation"
import type { RootState } from "../app/store";
import { UserData } from "../components/profile-page/UserData";
import { ReviewData } from "../components/profile-page/ReviewData";

export const ProfilePage = () => {
	const user = useSelector((state: RootState) => state.auth.user);

	const { data, isLoading, error } = useGetUser({
		user_id: user?.id,
	});

	if (isLoading) {
		return (
			<div className="flex h-[70vh] items-center justify-center">
				Loading...
			</div>
		);
	}

	if (error || !data?.data?.length) {
		return (
			<div className="flex h-[70vh] items-center justify-center">
				Something went wrong.
			</div>
		);
	}

	const profile = data.data[0];

	const profileImage =
		profile.profile_image ||
		"https://ui-avatars.com/api/?name=" +
		encodeURIComponent(`${profile.first_name} ${profile.last_name}`) +
		"&background=2563eb&color=fff&size=256";

	return (
		<div className="mx-auto max-w-6xl px-4 py-10 flex items-center justify-center gap-5 flex-col">
			<UserData profile={profile} profileImage={profileImage} />

			{/*  only a user will make bookings - so show these blocks to only him */}
			{profile.role === "USER" && (
				<>
					{/*<BookingData data={profile.booking} />*/}
					<ReviewData data={profile.reviews} />
				</>
			)}
		</div>
	);
};