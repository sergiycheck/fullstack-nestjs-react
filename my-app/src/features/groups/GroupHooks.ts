import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { RootState } from "../../app/store";
import { EntityId, AsyncThunk } from "@reduxjs/toolkit";
import { Group } from "./types";

export const UseToSelectOfFetchGroupsIds = ({
  selectGroupsIds,
  fetchGroupsAsync,
}: {
  selectGroupsIds: (state: RootState) => EntityId[];
  fetchGroupsAsync: AsyncThunk<Group[], void, {}>;
}) => {
  const dispatch = useAppDispatch();

  const groupIds = useAppSelector(selectGroupsIds);

  useEffect(() => {
    if (!groupIds.length) {
      dispatch(fetchGroupsAsync());
    }
  }, [dispatch, fetchGroupsAsync, groupIds]);

  return { groupIds };
};
