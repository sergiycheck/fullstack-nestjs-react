import { client } from "../../app/client";
import { usersEndpoint } from "../../app/api-endpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { User, usersSliceName } from "./types";
import { AppThunk } from "../../app/store";
import { selectGroupById } from "../groups/groupsSlice";
import { addUserIdIntoOneGroup, removeUserIdFromOneGroup } from "../groups/groupsSlice";
import { Group } from "../groups/types";

//TODO: refactor types move to types

const thunkTypes = {
  fetchUsers: `${usersSliceName}/fetchUsers`,
  fetchUserById: `${usersSliceName}/fetchUserById`,
  fetchAddUser: `${usersSliceName}/fetchAddUser`,
  fetchUpdateUser: `${usersSliceName}/fetchUpdateUser`,
  fetchDeleteUser: `${usersSliceName}/fetchDeleteUser`,
};

export const fetchUsersAsync = createAsyncThunk(thunkTypes.fetchUsers, async () => {
  let response = (await client.get(usersEndpoint)) as User[];
  if (!Array.isArray(response)) return [];
  return response;
});

export const fetchUserByIdAsync = createAsyncThunk(
  thunkTypes.fetchUserById,
  async ({ userId }: { userId: string }) => {
    const response = (await client.get(`${usersEndpoint}/${userId}`)) as User;
    return response;
  }
);

export type UserUpdateRequest = Omit<User, "created">;

export type UpdateUserResponse = {
  message: string;
  user: User;
  wasUpdated: boolean;
};

export const fetchUpdateUsersAsync = createAsyncThunk(
  thunkTypes.fetchUpdateUser,
  async ({ user }: { user: UserUpdateRequest }) => {
    const response = (await client.update(`${usersEndpoint}/${user.id}`, {
      ...user,
    })) as UpdateUserResponse;
    return response;
  }
);

export type deleteResponse = {
  message: string;
  wasDeleted: boolean;
  id: User["id"];
};

export const fetchDeleteUsersAsync = createAsyncThunk(
  thunkTypes.fetchDeleteUser,
  async ({ userId }: { userId: string }) => {
    const response = (await client.delete(`${usersEndpoint}/${userId}`)) as deleteResponse;
    return response;
  }
);

export type CreateUserRequest = {
  username: string;
  groupId?: string;
};

type CreateUserResponse = {
  user: User;
  message: string;
};

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
