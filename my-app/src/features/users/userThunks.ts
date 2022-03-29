import { client } from "../../app/client";
import { usersEndpoint } from "../../app/api-endpoints";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { User, usersSliceName } from "./types";

const thunkTypes = {
  fetchUsers: `${usersSliceName}/fetchUsers`,
  fetchUserById: `${usersSliceName}/fetchUserById`,
  fetchAddUser: `${usersSliceName}/fetchAddUser`,
  fetchUpdateUser: `${usersSliceName}/fetchUpdateUser`,
  fetchDeleteUser: `${usersSliceName}/fetchDeleteUser`,
};

export const fetchUsersAsync = createAsyncThunk(thunkTypes.fetchUsers, async () => {
  const response = await client.get(usersEndpoint);
  if (!Array.isArray(response)) return [];
  return response;
});

export const fetchUsersByIdAsync = createAsyncThunk(
  thunkTypes.fetchUserById,
  async ({ userId }: { userId: string }) => {
    const response = await client.get(`${usersEndpoint}/${userId}`);
    return response;
  }
);

type UserUpdateRequest = Pick<User, "id" | "username">;

type UpdateResponse = {
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

type deleteResponse = {
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

export const fetchAddUserAsync = createAsyncThunk(
  thunkTypes.fetchAddUser,
  async ({ username }: { username: string }) => {
    const response = await client.post(usersEndpoint, { username });
    return response;
  }
);
