import { User } from "./types";
import { Group } from "../groups/types";

type ContainGroupField = { group?: Group };
export type UserResponseType = Omit<User, "groupId"> & ContainGroupField;

export function mapUserResponse(userResp: UserResponseType): User {
  let { group } = userResp;
  delete userResp.group;
  return {
    ...userResp,
    groupId: group ? group.id : null,
  };
}
