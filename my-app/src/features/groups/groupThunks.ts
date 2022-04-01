import { client } from "../../app/client";
import {
  groupsEndpoint,
  removeUserFromGroupEndPoint,
  addUserToGroupEndPoint,
} from "../../app/api-endpoints";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { Group, groupsSliceName } from "./types";
import { AppThunk } from "../../app/store";
import { User } from "../users/types";
import { removeUserIdFromOneGroup, selectGroupById } from "./groupsSlice";
import { updateOneUser } from "../users/usersSlice";

import { fetchUsersByIdsAndUpdateAsync } from "../users/userThunks";

//TODO: refactor types move to types

const thunkTypes = {
  fetchGroups: `${groupsSliceName}/fetchGroups`,
  fetchGroupById: `${groupsSliceName}/fetchGroupById`,
  fetchAddGroup: `${groupsSliceName}/fetchAddGroup`,
  fetchUpdateGroup: `${groupsSliceName}/fetchUpdateGroup`,
  fetchDeleteGroup: `${groupsSliceName}/fetchDeleteGroup`,

  fetchRemoveUserFromGroup: `${groupsSliceName}/fetchRemoveUserFromGroup`,
  fetchAddUserToGroup: `${groupsSliceName}/fetchAddUserToGroup`,
};

export const fetchGroupsAsync = createAsyncThunk(thunkTypes.fetchGroups, async () => {
  let response = (await client.get(groupsEndpoint)) as Group[];
  if (!Array.isArray(response)) return [];

  return response;
});

export const fetchGroupByIdAsync = createAsyncThunk(
  thunkTypes.fetchGroupById,
  async ({ groupId }: { groupId: string }) => {
    const response = (await client.get(`${groupsEndpoint}/${groupId}`)) as Group;
    return response;
  }
);

export type GroupCreateReq = {
  name: string;
  description: string;
  userIds?: string[];
};

export type GroupCreateRes = {
  message: string;
  group: Group;
};

export const fetchAddGroupAsync = createAsyncThunk(
  thunkTypes.fetchAddGroup,
  async ({ group }: { group: GroupCreateReq }) => {
    const response = (await client.post(groupsEndpoint, { ...group })) as GroupCreateRes;
    return response;
  }
);

export const fetchAddGroupAsyncAndFetchUpdateUsersAsync =
  ({ group }: { group: GroupCreateReq }): AppThunk =>
  async (dispatch, getState) => {
    const response = await dispatch(fetchAddGroupAsync({ group })).unwrap();
    const { userIds } = response.group;
    if (userIds) {
      await dispatch(fetchUsersByIdsAndUpdateAsync({ userIds }));
    }

    return response;
  };

type GroupUpdateRequest = Omit<Group, "userIds">;

type UpdateResponse = {
  message: string;
  group: Group;
  wasUpdated: boolean;
};

export const fetchUpdateGroupsAsync = createAsyncThunk(
  thunkTypes.fetchUpdateGroup,
  async (group: GroupUpdateRequest) => {
    const response = (await client.update(`${groupsEndpoint}/${group.id}`, {
      ...group,
    })) as UpdateResponse;
    return response;
  }
);

type DeleteResponse = {
  message: string;
  wasDeleted: boolean;
  id: Group["id"];
};

export const fetchDeleteGroupAsync = createAsyncThunk(
  thunkTypes.fetchDeleteGroup,
  async ({ groupId }: { groupId: string }) => {
    const response = (await client.delete(`${groupsEndpoint}/${groupId}`)) as DeleteResponse;
    return response;
  }
);

export type RemoveOrAddUserToGroupResponse = {
  success: boolean;
  user: User;
  message: string;
  userId: string;
  groupId: string;
};

export const fetchRemoveUserFromGroupAsync = createAsyncThunk(
  thunkTypes.fetchRemoveUserFromGroup,
  async ({ groupId, userId }: { groupId: string; userId: string }) => {
    const endPoint = removeUserFromGroupEndPoint.replace(":groupId", groupId);

    const response = (await client.update(endPoint, {
      id: groupId,
      userId,
    })) as RemoveOrAddUserToGroupResponse;
    return response;
  }
);

export const removeUserFromGroupThunk =
  (groupId: string, userId: string): AppThunk =>
  async (dispatch, getState) => {
    const groupToUpdate = selectGroupById(getState(), groupId) as Group;
    const response = await dispatch(fetchRemoveUserFromGroupAsync({ groupId, userId })).unwrap();
    const user = response.user;
    dispatch(updateOneUser(user));
    dispatch(removeUserIdFromOneGroup({ group: groupToUpdate, userIdToRemove: response.userId }));
    return response;
  };

export const fetchAddUserToGroupAsync = createAsyncThunk(
  thunkTypes.fetchAddUserToGroup,
  async ({ groupId, userId }: { groupId: string; userId: string }) => {
    const endPoint = addUserToGroupEndPoint.replace(":groupId", groupId);

    const response = (await client.update(endPoint, {
      id: groupId,
      userId,
    })) as RemoveOrAddUserToGroupResponse;
    return response;
  }
);
