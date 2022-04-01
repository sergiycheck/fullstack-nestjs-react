import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createEntityAdapter } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { User, usersSliceName } from "./types";
import {
  fetchUsersAsync,
  fetchUserByIdAsync,
  fetchAddUserAsync,
  fetchUpdateUsersAsync,
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
  reducers: {
    updateOneUser: (state: any, action: PayloadAction<User>) => {
      const updatedUser = action.payload;
      usersAdapter.updateOne(state, { id: updatedUser.id, changes: { ...updatedUser } });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersAsync.pending, (state) => {
        state.status = StatusData.loading;
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.status = StatusData.fulfilled;
        const users: User[] = action.payload;
        usersAdapter.upsertMany(state, users);
      })
      .addCase(fetchUserByIdAsync.fulfilled, (state, action) => {
        const user = action.payload;
        usersAdapter.upsertOne(state, user);
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

export const { updateOneUser } = usersSlice.actions;

export const {
  selectAll: selectUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors((state: RootState) => state.users);

export const selectUsersStatus = (state: RootState) => state.users.status;

export const selectUsersWithoutGroup = createSelector(
  (state: RootState) => selectUsers(state),
  (users) => users.filter((u) => !u.groupId)
);

export const selectUsersIdsByGroupId = (groupId: string) => (state: RootState) => {
  const users = selectUsers(state);
  const filteredUsers = users.filter((u) => u.groupId === groupId);
  return filteredUsers.map((u) => u.id);
};

export default usersSlice.reducer;
