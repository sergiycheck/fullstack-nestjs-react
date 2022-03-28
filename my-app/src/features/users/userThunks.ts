import { client } from "../../app/client";
import { usersEndpoint } from "../../app/api-endpoints";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { usersSliceName } from "./types";

const thunkTypes = {
  fetchUsers: `${usersSliceName}/fetchUsers`,
  fetchAddUser: `${usersSliceName}/fetchAddUser`,
};

export const fetchUsersAsync = createAsyncThunk(thunkTypes.fetchUsers, async () => {
  const response = await client.get(usersEndpoint);
  if (!Array.isArray(response)) return [];
  return response;
});

export const fetchAddUserAsync = createAsyncThunk(
  thunkTypes.fetchAddUser,
  async ({ username }: { username: string }) => {
    const response = await client.post(usersEndpoint, { username });
    return response;
  }
);
