import { createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../../app/client";
import {
  groupsEndpoint,
  removeUserFromGroupEndPoint,
  addUserToGroupEndPoint,
} from "../../app/api-endpoints";
import { AppThunk } from "../../app/store";
import { removeUserIdFromOneGroup, selectGroupById } from "./groupsSlice";
import { updateOneUser } from "../users/usersSlice";
import { fetchUsersByIdsAndUpdateAsync } from "../users/userThunks";
import { thunkTypes } from "./thunk.types";
import {
  Group,
  GroupCreateReq,
  GroupCreateRes,
  GroupUpdateRequest,
  UpdateResponse,
  DeleteResponse,
  RemoveOrAddUserToGroupResponse,
} from "./types";

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

export const fetchUpdateGroupsAsync = createAsyncThunk(
  thunkTypes.fetchUpdateGroup,
  async (group: GroupUpdateRequest) => {
    const response = (await client.update(`${groupsEndpoint}/${group.id}`, {
      ...group,
    })) as UpdateResponse;
    return response;
  }
);

export const fetchDeleteGroupAsync = createAsyncThunk(
  thunkTypes.fetchDeleteGroup,
  async ({ groupId }: { groupId: string }) => {
    const response = (await client.delete(`${groupsEndpoint}/${groupId}`)) as DeleteResponse;
    return response;
  }
);

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
