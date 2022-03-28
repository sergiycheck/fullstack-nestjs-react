import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createEntityAdapter } from "@reduxjs/toolkit";
import { getUsersEndpoint } from "../../app/api-endpoints";
import { client } from "../../app/client";
import { RootState, AppThunk } from "../../app/store";

export interface User {
  id: string;
  username: string;
  created: string;
}

const usersAdapter = createEntityAdapter<User>({
  sortComparer: (u1, u2) => {
    const u1CreatedTime = new Date(u1.created).getTime();
    const u2CreatedTime = new Date(u1.created).getTime();
    if (u1CreatedTime === u2CreatedTime) return 0;
    return u1CreatedTime > u2CreatedTime ? 1 : 0;
  },
});

export interface UsersState {
  name: string;
  status: "idle" | "loading" | "failed";
}
const initialState = usersAdapter.getInitialState<UsersState>({
  name: "users",
  status: "idle",
});

export const fetchUsersAsync = createAsyncThunk(`${initialState.name}/fetchUsers`, async () => {
  const response = await client.get(getUsersEndpoint);
  if (!Array.isArray(response)) return [];

  return response;
});

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const users: User[] = action.payload;
        usersAdapter.upsertMany(state, users);
      });
  },
});

export const {} = usersSlice.actions;

export const {
  selectAll: selectUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors((state: RootState) => state.users);

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const incrementIfOdd = (): AppThunk => (dispatch, getState) => {};

export default usersSlice.reducer;
