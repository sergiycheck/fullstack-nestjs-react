import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { RootState } from "../../app/store";
import { EntityId, AsyncThunk } from "@reduxjs/toolkit";
import { Group } from "./types";
import { selectGroupsStatus } from "./groupsSlice";
import { StatusData } from "../shared/types";

export const useToSelectOfFetchGroupsIds = ({
  selectGroupsIds,
  fetchGroupsAsync,
}: {
  selectGroupsIds: (state: RootState) => EntityId[];
  fetchGroupsAsync: AsyncThunk<Group[], void, {}>;
}) => {
  const dispatch = useAppDispatch();

  const groupIds = useAppSelector(selectGroupsIds);
  const status = useAppSelector(selectGroupsStatus);

  useEffect(() => {
    if (status === StatusData.idle) {
      dispatch(fetchGroupsAsync());
    }
  });

  return { groupIds };
};

export const useGroupIdToSelectOrFetchGroup = ({
  groupId,
  selectGroupById,
  fetchGroupByIdAsync,
}: {
  groupId: string;
  selectGroupById: (state: RootState, id: EntityId) => Group | undefined;
  fetchGroupByIdAsync: AsyncThunk<
    any,
    {
      groupId: string;
    },
    {}
  >;
}) => {
  const dispatch = useAppDispatch();

  const group = useAppSelector((state) => selectGroupById(state, groupId));

  useEffect(() => {
    if (!group) {
      dispatch(fetchGroupByIdAsync({ groupId }));
    }
  }, [groupId, dispatch, group, fetchGroupByIdAsync]);

  return group;
};
