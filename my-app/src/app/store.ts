import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import usersReducer from "../features/users/usersSlice";
import groupsReducer from "../features/groups/groupsSlice";
import { loggerMiddleware } from "./middewares";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    groups: groupsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(loggerMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
