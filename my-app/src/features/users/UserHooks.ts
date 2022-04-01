import { useEffect } from "react";
import { EntityId, AsyncThunk } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "./../../app/hooks";
import { User } from "./types";
import { RootState } from "../../app/store";
import { selectUsersStatus } from "./usersSlice";
import { StatusData } from "../shared/types";

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

export const useToSelectOfFetchUserIds = ({
  selectUserIds,
  fetchUsersAsync,
}: {
  selectUserIds: (state: RootState) => EntityId[];
  fetchUsersAsync: AsyncThunk<User[], void, {}>;
}) => {
  const dispatch = useAppDispatch();

  const entityIds = useAppSelector(selectUserIds);

  const status = useAppSelector(selectUsersStatus);

  useEffect(() => {
    if (status === StatusData.idle) {
      dispatch(fetchUsersAsync());
    }
  });

  return { entityIds };
};
