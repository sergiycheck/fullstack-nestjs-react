import { client } from "../../app/client";
import { groupsEndpoint } from "../../app/api-endpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Group, groupsSliceName } from "./types";
import { GroupResponseType, mapGroupResponse } from "./mappings";

//TODO: refactor types move to types

const thunkTypes = {
  fetchGroups: `${groupsSliceName}/fetchGroups`,
  fetchGroupById: `${groupsSliceName}/fetchGroupById`,
  fetchAddGroup: `${groupsSliceName}/fetchAddGroup`,
  fetchUpdateGroup: `${groupsSliceName}/fetchUpdateGroup`,
  fetchDeleteGroup: `${groupsSliceName}/fetchDeleteGroup`,
};

export const fetchGroupsAsync = createAsyncThunk(thunkTypes.fetchGroups, async () => {
  let response = (await client.get(groupsEndpoint)) as GroupResponseType[];
  if (!Array.isArray(response)) return [];
  let responseMapped = response.map(mapGroupResponse) as Group[];
  return responseMapped;
});

export const fetchGroupsByIdAsync = createAsyncThunk(
  thunkTypes.fetchGroupById,
  async ({ groupId }: { groupId: string }) => {
    const response = (await client.get(`${groupsEndpoint}/${groupId}`)) as Group;
    const group = mapGroupResponse(response);
    return group;
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

type GroupUpdateRequest = Omit<Group, "userIds">;

type UpdateResponse = {
  message: string;
  group: Group;
  wasUpdated: boolean;
};

export const fetchUpdateGroupsAsync = createAsyncThunk(
  thunkTypes.fetchUpdateGroup,
  async ({ group }: { group: GroupUpdateRequest }) => {
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

export const fetchDeleteGroupsAsync = createAsyncThunk(
  thunkTypes.fetchDeleteGroup,
  async ({ groupId }: { groupId: string }) => {
    const response = (await client.delete(`${groupsEndpoint}/${groupId}`)) as DeleteResponse;
    return response;
  }
);
