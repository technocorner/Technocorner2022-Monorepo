import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

// Define a type for the slice state
interface authState {
  value: { teamName: string; userName: string; role: string };
}

// Define the initial state using that type
const initialState: authState = {
  value: { teamName: "", userName: "", role: "user" },
};

export const authSlice = createSlice({
  name: "auth",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    set: (
      state,
      actions: PayloadAction<{
        teamName: string;
        userName: string;
        role: string;
      }>
    ) => {
      state.value = actions.payload;
    },
    reset: (state) => {
      state.value = { teamName: "", userName: "", role: "user" };
    },
  },
});

export const { set, reset } = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAuth = (state: RootState) => state.auth.value;

export default authSlice.reducer;
