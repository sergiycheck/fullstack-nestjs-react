import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createEntityAdapter } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";
import { fetchGroupsAsync } from "./groupThunks";
import { Group, groupsSliceName } from "./types";

import { StatusData } from "../shared/types";

const groupsAdapter = createEntityAdapter<Group>({
  sortComparer: (g1, g2) => {
    if (g1.userIds?.length === g2.userIds?.length) return 0;
    return g1.userIds!.length > g2.userIds!.length ? 1 : 0;
  },
});

export interface GroupsState {
  name: string;
  status: keyof typeof StatusData;
}
const initialState = groupsAdapter.getInitialState<GroupsState>({
  name: groupsSliceName,
  status: StatusData.idle,
});

export const groupsSlice = createSlice({
  name: initialState.name,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //TODO: check whether the response is valid
    builder
      .addCase(fetchGroupsAsync.pending, (state) => {
        state.status = StatusData.loading;
      })
      .addCase(fetchGroupsAsync.fulfilled, (state, action) => {
        state.status = StatusData.idle;
        const groups = action.payload;
        groupsAdapter.upsertMany(state, groups);
      });
    // .addCase(fetchAddUserAsync.fulfilled, (state, action) => {
    //   const user: User = action.payload.user;
    //   usersAdapter.upsertOne(state, user);
    // })
    // .addCase(fetchUpdateUsersAsync.fulfilled, (state, action) => {
    //   if (!action.payload.wasUpdated) return;
    //   const updatedUser = action.payload.user;
    //   usersAdapter.updateOne(state, { id: updatedUser.id, changes: { ...updatedUser } });
    // })
    // .addCase(fetchDeleteUsersAsync.fulfilled, (state, action) => {
    //   if (!action.payload.wasDeleted) return;
    //   const deletedUserId = action.payload.id;
    //   usersAdapter.removeOne(state, deletedUserId);
    // });
  },
});

export const {} = groupsSlice.actions;

export const {
  selectAll: selectGroups,
  selectById: selectGroupById,
  selectIds: selectGroupsIds,
} = groupsAdapter.getSelectors((state: RootState) => state.groups);

export default groupsSlice.reducer;
