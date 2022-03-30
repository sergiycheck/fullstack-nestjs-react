import { User } from "../users/types";
import { Group } from "./types";

type ContainUsersField = { users?: User[] };
export type GroupResponseType = Omit<Group, "userIds"> & ContainUsersField;

export function mapGroupResponse(groupResp: GroupResponseType): Group {
  let { users } = groupResp;
  delete groupResp.users;
  return {
    ...groupResp,
    userIds: users?.length ? users.map((u) => u.id) : [],
  };
}
