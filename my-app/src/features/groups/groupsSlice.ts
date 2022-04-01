import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createEntityAdapter } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import {
  fetchGroupsAsync,
  fetchGroupByIdAsync,
  fetchAddGroupAsync,
  fetchUpdateGroupsAsync,
  fetchDeleteGroupAsync,
} from "./groupThunks";
import { Group, groupsSliceName } from "./types";

import { StatusData } from "../shared/types";

const groupsAdapter = createEntityAdapter<Group>();

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
  reducers: {
    addUserIdIntoOneGroup: (
      state: any,
      action: PayloadAction<{ group: Group } & { newUserId: string }>
    ) => {
      const { group: toUpdateGroupObj } = action.payload;
      const { newUserId } = action.payload;

      let currentUserIds: string[] = [];
      if (toUpdateGroupObj.userIds) {
        currentUserIds = toUpdateGroupObj.userIds;
      }

      const newUserIds = [...currentUserIds, newUserId];

      groupsAdapter.updateOne(state, {
        id: toUpdateGroupObj.id,
        changes: { userIds: newUserIds },
      });
    },
    removeUserIdFromOneGroup: (
      state: any,
      action: PayloadAction<{ group: Group } & { userIdToRemove: string }>
    ) => {
      const { group: toUpdateGroupObj } = action.payload;

      let currentUserIds: string[] = [];
      if (toUpdateGroupObj.userIds) {
        currentUserIds = toUpdateGroupObj.userIds;
      }
      const { userIdToRemove } = action.payload;
      const filteredUserIds = currentUserIds.filter((uIds) => uIds !== userIdToRemove);
      groupsAdapter.updateOne(state, {
        id: toUpdateGroupObj.id,
        changes: { userIds: filteredUserIds },
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroupsAsync.pending, (state) => {
        state.status = StatusData.loading;
      })
      .addCase(fetchGroupsAsync.fulfilled, (state, action) => {
        state.status = StatusData.fulfilled;
        const groups = action.payload;
        groupsAdapter.upsertMany(state, groups);
      })
      .addCase(fetchGroupByIdAsync.fulfilled, (state, action) => {
        const group = action.payload;
        groupsAdapter.upsertOne(state, group);
      })
      .addCase(fetchAddGroupAsync.fulfilled, (state, action) => {
        const { group }: { group: Group } = action.payload;
        groupsAdapter.upsertOne(state, group);
      })
      .addCase(fetchUpdateGroupsAsync.fulfilled, (state, action) => {
        if (!action.payload.wasUpdated) return;
        const { group }: { group: Group } = action.payload;
        groupsAdapter.updateOne(state, { id: group.id, changes: { ...group } });
      })
      .addCase(fetchDeleteGroupAsync.fulfilled, (state, action) => {
        if (!action.payload.wasDeleted) return;
        const deletedGroupId = action.payload.id;
        groupsAdapter.removeOne(state, deletedGroupId);
      });
  },
});

export const { addUserIdIntoOneGroup, removeUserIdFromOneGroup } = groupsSlice.actions;

export const selectGroupsStatus = (state: RootState) => state.groups.status;

export const {
  selectAll: selectGroups,
  selectById: selectGroupById,
  selectIds: selectGroupsIds,
} = groupsAdapter.getSelectors((state: RootState) => state.groups);

export default groupsSlice.reducer;
