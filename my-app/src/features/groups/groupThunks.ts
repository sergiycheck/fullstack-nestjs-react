import { client } from "../../app/client";
import { groupsEndpoint } from "../../app/api-endpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Group, groupsSliceName } from "./types";
import { GroupResponseType, mapGroupResponse } from "./mappings";

//TODO: refactor types move to types

const thunkTypes = {
  fetchGroups: `${groupsSliceName}/fetchGroups`,
  // fetchUserById: `${usersSliceName}/fetchUserById`,
  // fetchAddUser: `${usersSliceName}/fetchAddUser`,
  // fetchUpdateUser: `${usersSliceName}/fetchUpdateUser`,
  // fetchDeleteUser: `${usersSliceName}/fetchDeleteUser`,
};

export const fetchGroupsAsync = createAsyncThunk(thunkTypes.fetchGroups, async () => {
  let response = (await client.get(groupsEndpoint)) as GroupResponseType[];
  if (!Array.isArray(response)) return [];
  let responseMapped = response.map(mapGroupResponse) as Group[];
  return responseMapped;
});

// export const fetchGroupsByIdAsync = createAsyncThunk(
//   thunkTypes.fetchUserById,
//   async ({ userId }: { userId: string }) => {
//     const response = await client.get(`${usersEndpoint}/${userId}`);
//     const user = mapUserResponse(response);
//     return user;
//   }
// );

// type UserUpdateRequest = Pick<User, "id" | "username">;

// type UpdateResponse = {
//   message: string;
//   user: User;
//   wasUpdated: boolean;
// };

// export const fetchUpdateUsersAsync = createAsyncThunk(
//   thunkTypes.fetchUpdateUser,
//   async ({ user }: { user: UserUpdateRequest }) => {
//     const response = (await client.update(`${usersEndpoint}/${user.id}`, {
//       ...user,
//     })) as UpdateResponse;
//     return response;
//   }
// );

// type deleteResponse = {
//   message: string;
//   wasDeleted: boolean;
//   id: User["id"];
// };

// export const fetchDeleteUsersAsync = createAsyncThunk(
//   thunkTypes.fetchDeleteUser,
//   async ({ userId }: { userId: string }) => {
//     const response = (await client.delete(`${usersEndpoint}/${userId}`)) as deleteResponse;
//     return response;
//   }
// );

// export const fetchAddUserAsync = createAsyncThunk(
//   thunkTypes.fetchAddUser,
//   async ({ username }: { username: string }) => {
//     const response = await client.post(usersEndpoint, { username });
//     return response;
//   }
// );
