import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createEntityAdapter } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";
import { User, usersSliceName } from "./types";
import {
  fetchAddUserAsync,
  fetchUpdateUsersAsync,
  fetchUsersAsync,
  fetchDeleteUsersAsync,
} from "./userThunks";

import { StatusData } from "../shared/types";

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
    //TODO: check whether the response is valid
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
      })
      .addCase(fetchUpdateUsersAsync.fulfilled, (state, action) => {
        if (!action.payload.wasUpdated) return;
        const updatedUser = action.payload.user;
        usersAdapter.updateOne(state, { id: updatedUser.id, changes: { ...updatedUser } });
      })
      .addCase(fetchDeleteUsersAsync.fulfilled, (state, action) => {
        if (!action.payload.wasDeleted) return;
        const deletedUserId = action.payload.id;
        usersAdapter.removeOne(state, deletedUserId);
      });
  },
});

export const {} = usersSlice.actions;

export const {
  selectAll: selectUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors((state: RootState) => state.users);

export const incrementIfOdd = (): AppThunk => (dispatch, getState) => {};

export default usersSlice.reducer;
