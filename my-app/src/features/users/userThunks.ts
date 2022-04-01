import { client } from "../../app/client";
import { usersEndpoint, findUsersByIdsPostEndPoint } from "../../app/api-endpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppThunk } from "../../app/store";
import { selectGroupById } from "../groups/groupsSlice";
import { addUserIdIntoOneGroup, removeUserIdFromOneGroup } from "../groups/groupsSlice";
import { Group } from "../groups/types";
import { thunkTypes } from "./thunk.types";
import {
  User,
  UserUpdateRequest,
  UpdateUserResponse,
  DeleteResponse,
  CreateUserRequest,
  CreateUserResponse,
} from "./types";

export const fetchUsersAsync = createAsyncThunk(thunkTypes.fetchUsers, async () => {
  let response = (await client.get(usersEndpoint)) as User[];
  if (!Array.isArray(response)) return [];
  return response;
});

//dispatch this thunk after add group
export const fetchUsersByIdsAndUpdateAsync = createAsyncThunk(
  thunkTypes.fetchUsersByIdsAndUpdateAsync,
  async ({ userIds }: { userIds: string[] }) => {
    let resp = (await client.post(findUsersByIdsPostEndPoint, { userIds })) as User[];
    if (!Array.isArray(resp)) return [];
    return resp;
  }
);

export const fetchUserByIdAsync = createAsyncThunk(
  thunkTypes.fetchUserById,
  async ({ userId }: { userId: string }) => {
    const response = (await client.get(`${usersEndpoint}/${userId}`)) as User;
    return response;
  }
);

export const fetchUpdateUsersAsync = createAsyncThunk(
  thunkTypes.fetchUpdateUser,
  async ({ user }: { user: UserUpdateRequest }) => {
    const response = (await client.update(`${usersEndpoint}/${user.id}`, {
      ...user,
    })) as UpdateUserResponse;
    return response;
  }
);

export const fetchDeleteUsersAsync = createAsyncThunk(
  thunkTypes.fetchDeleteUser,
  async ({ userId }: { userId: string }) => {
    const response = (await client.delete(`${usersEndpoint}/${userId}`)) as DeleteResponse;
    return response;
  }
);

export const fetchAddUserAsync = createAsyncThunk(
  thunkTypes.fetchAddUser,
  async (createUserReq: CreateUserRequest) => {
    const response = (await client.post(usersEndpoint, {
      ...createUserReq,
    })) as CreateUserResponse;
    return response;
  }
);

export const fetchCreateUserAndUpdateAddGroupUserIds =
  (createUserReq: CreateUserRequest): AppThunk =>
  async (dispatch, getState) => {
    let response: CreateUserResponse;
    if (createUserReq?.groupId) {
      const { username, groupId } = createUserReq;
      const groupToUpdate = selectGroupById(getState(), groupId) as Group;

      response = (await dispatch(
        fetchAddUserAsync({ username, groupId })
      ).unwrap()) as CreateUserResponse;

      dispatch(addUserIdIntoOneGroup({ group: groupToUpdate, newUserId: response.user.id }));
    } else {
      response = await dispatch(fetchAddUserAsync({ ...createUserReq })).unwrap();
    }

    return response;
  };

export const fetchUpdateUserAndRemoveItIdFromGroup =
  (user: UserUpdateRequest, userOldGroup: Group): AppThunk =>
  async (dispatch, getState) => {
    let response: UpdateUserResponse;

    response = (await dispatch(fetchUpdateUsersAsync({ user })).unwrap()) as UpdateUserResponse;
    const { user: userUpdated } = response;
    dispatch(removeUserIdFromOneGroup({ group: userOldGroup, userIdToRemove: userUpdated.id }));

    return response;
  };

export const fetchUpdateUserAndAddItIdToGroup =
  (user: UserUpdateRequest): AppThunk =>
  async (dispatch, getState) => {
    let response: UpdateUserResponse;
    const groupId = user.groupId as string;

    const groupToUpdate = selectGroupById(getState(), groupId) as Group;

    response = (await dispatch(fetchUpdateUsersAsync({ user })).unwrap()) as UpdateUserResponse;
    const { user: userUpdated } = response;

    dispatch(addUserIdIntoOneGroup({ group: groupToUpdate, newUserId: userUpdated.id }));
    return response;
  };

export const fetchUpdateUserAnMoveItIdToOtherGroup =
  (user: UserUpdateRequest, userOldGroup: Group): AppThunk =>
  async (dispatch, getState) => {
    let response: UpdateUserResponse;
    let groupId = user.groupId as string;

    const groupToUpdateAdd = selectGroupById(getState(), groupId) as Group;

    response = (await dispatch(fetchUpdateUsersAsync({ user })).unwrap()) as UpdateUserResponse;
    const { user: userUpdated } = response;

    dispatch(removeUserIdFromOneGroup({ group: userOldGroup, userIdToRemove: userUpdated.id }));
    dispatch(addUserIdIntoOneGroup({ group: groupToUpdateAdd, newUserId: userUpdated.id }));

    return response;
  };
