import { useSelector } from "react-redux";
import { useGetUser } from "../api/user/user-mutation"
import type { RootState } from "../app/store";
import { UserData } from "../components/profile-page/UserData";
import { ReviewData } from "../components/profile-page/ReviewData";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";

export const ProfilePage = () => {
	const user = useSelector((state: RootState) => state.auth.user);

	const { data, isLoading, error } = useGetUser({
		user_id: user?.id,
	});

	if (isLoading) {
		return (
			<div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-5 px-4 py-10">
				<Card className="w-full overflow-hidden rounded-2xl py-0 shadow-lg">
					<CardHeader className="border-b bg-slate-50 py-4">
						<CardTitle>
							<Skeleton className="h-10 w-50" />
						</CardTitle>
					</CardHeader>

					{/* Actions */}
					<div className="flex items-center justify-end gap-4 px-5 py-2">
						{Array.from({ length: 3 }).map((_, index) => (
							<Skeleton key={index} className="h-8 w-20" />
						))}
					</div>

					<CardContent className="grid gap-10 p-8 md:grid-cols-[260px_1fr]">
						{/* Left Section */}
						<div className="flex flex-col items-center">
							<Skeleton className="h-48 w-48 rounded-full" />
							<Skeleton className="mt-5 h-8 w-50" />
							<Skeleton className="mt-1 h-8 w-20" />
						</div>

						{/* Right Section */}
						<div className="grid gap-6 md:grid-cols-2">
							{Array.from({ length: 5 }).map((_, index) => (
								<div key={index} className="space-y-2">
									<Skeleton className="h-8 w-40" />
									<Skeleton className="h-8 w-full" />
								</div>
							))}
						</div>
					</CardContent>
				</Card>
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