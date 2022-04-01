import { User } from "../users/types";

export const groupsSliceName = "groups";

export interface Group {
  id: string;
  name: string;
  description: string;
  userIds: string[] | null;
}

export type GroupCreateReq = {
  name: string;
  description: string;
  userIds?: string[];
};

export type GroupCreateRes = {
  message: string;
  group: Group;
};

export type GroupUpdateRequest = Omit<Group, "userIds">;

export type UpdateResponse = {
  message: string;
  group: Group;
  wasUpdated: boolean;
};

export type DeleteResponse = {
  message: string;
  wasDeleted: boolean;
  id: Group["id"];
};

export type RemoveOrAddUserToGroupResponse = {
  success: boolean;
  user: User;
  message: string;
  userId: string;
  groupId: string;
};
