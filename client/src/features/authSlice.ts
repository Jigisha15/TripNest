import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
	id: string;
	email_id: string;
	role: string;
	token: string;
}

interface UserState {
	user: User | null;
}

const initialState: UserState = {
	user: null,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<User>) => {
			console.log("payload : ", state);
			state.user = action.payload;
		},

		logout: (state) => {
			state.user = null;
		},

		updateUser: (state, action: PayloadAction<Partial<User>>) => {
			if (state.user) {
				state.user = {
					...state.user,
					...action.payload,
				};
			}
		},
	},
});

export const { setUser, logout, updateUser } = userSlice.actions;

export default userSlice.reducer;