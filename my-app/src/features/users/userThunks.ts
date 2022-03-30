import { client } from "../../app/client";
import { usersEndpoint } from "../../app/api-endpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { User, usersSliceName } from "./types";
import { UserResponseType, mapUserResponse } from "./mappings";

//TODO: refactor types move to types

const thunkTypes = {
  fetchUsers: `${usersSliceName}/fetchUsers`,
  fetchUserById: `${usersSliceName}/fetchUserById`,
  fetchAddUser: `${usersSliceName}/fetchAddUser`,
  fetchUpdateUser: `${usersSliceName}/fetchUpdateUser`,
  fetchDeleteUser: `${usersSliceName}/fetchDeleteUser`,
};

export const fetchUsersAsync = createAsyncThunk(thunkTypes.fetchUsers, async () => {
  let response = (await client.get(usersEndpoint)) as UserResponseType[];
  if (!Array.isArray(response)) return [];
  let responseMapped = response.map(mapUserResponse) as User[];
  return responseMapped;
});

export const fetchUsersByIdAsync = createAsyncThunk(
  thunkTypes.fetchUserById,
  async ({ userId }: { userId: string }) => {
    const response = await client.get(`${usersEndpoint}/${userId}`);
    const user = mapUserResponse(response);
    return user;
  }
);

export type UserUpdateRequest = Pick<User, "id" | "username" | "groupId">;

export type UpdateResponse = {
  message: string;
  user: User;
  wasUpdated: boolean;
};

export const fetchUpdateUsersAsync = createAsyncThunk(
  thunkTypes.fetchUpdateUser,
  async ({ user }: { user: UserUpdateRequest }) => {
    const response = (await client.update(`${usersEndpoint}/${user.id}`, {
      ...user,
    })) as UpdateResponse;
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

export const fetchAddUserAsync = createAsyncThunk(
  thunkTypes.fetchAddUser,
  async ({ username, groupId }: CreateUserRequest) => {
    const response = await client.post(usersEndpoint, { username, groupId });
    return response;
  }
);
