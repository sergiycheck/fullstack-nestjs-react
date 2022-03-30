import { useEffect } from "react";
import { EntityId, AsyncThunk } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "./../../app/hooks";
import { User } from "./types";
import { RootState } from "../../app/store";

export const useUserIdToSelectOrFetchUser = ({
  userId,
  selectUserById,
  fetchUserByIdAsync,
}: {
  userId: string;
  selectUserById: (state: RootState, id: EntityId) => User | undefined;
  fetchUserByIdAsync: AsyncThunk<
    any,
    {
      userId: string;
    },
    {}
  >;
}) => {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => selectUserById(state, userId));

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserByIdAsync({ userId }));
    }
  }, [userId, dispatch, user, fetchUserByIdAsync]);

  return user;
};

type SelectorUsersType = (state: RootState) => User[];

export const useToSelectOfFetchUsers = ({
  selectUsers,
  fetchUsersAsync,
}: {
  selectUsers: (args: any) => User[];
  fetchUsersAsync: AsyncThunk<User[], void, {}>;
}) => {
  const dispatch = useAppDispatch();

  const entities = useAppSelector(selectUsers);

  useEffect(() => {
    if (!entities.length) {
      dispatch(fetchUsersAsync());
    }
  }, [dispatch, fetchUsersAsync, entities]);

  return { entities };
};
