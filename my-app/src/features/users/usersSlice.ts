import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createEntityAdapter } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";
import { StatusData, User, usersSliceName } from "./types";
import { fetchAddUserAsync, fetchUsersAsync } from "./userThunks";

const usersAdapter = createEntityAdapter<User>({
  sortComparer: (u1, u2) => {
    const u1CreatedTime = new Date(u1.created).getTime();
    const u2CreatedTime = new Date(u1.created).getTime();
    if (u1CreatedTime === u2CreatedTime) return 0;
    return u1CreatedTime > u2CreatedTime ? 1 : 0;
  },
});

export interface UsersState {
  name: string;
  status: keyof typeof StatusData;
}
const initialState = usersAdapter.getInitialState<UsersState>({
  name: usersSliceName,
  status: StatusData.idle,
});

export const usersSlice = createSlice({
  name: initialState.name,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersAsync.pending, (state) => {
        state.status = StatusData.loading;
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.status = StatusData.idle;
        const users: User[] = action.payload;
        usersAdapter.upsertMany(state, users);
      })
      .addCase(fetchAddUserAsync.fulfilled, (state, action) => {
        const user: User = action.payload.user;
        usersAdapter.upsertOne(state, user);
      });
  },
});

export const {} = usersSlice.actions;

export const {
  selectAll: selectUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors((state: RootState) => state.users);

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const incrementIfOdd = (): AppThunk => (dispatch, getState) => {};

export default usersSlice.reducer;
