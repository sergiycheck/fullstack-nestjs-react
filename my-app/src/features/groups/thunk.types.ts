import { groupsSliceName } from "./types";

export const thunkTypes = {
  fetchGroups: `${groupsSliceName}/fetchGroups`,
  fetchGroupById: `${groupsSliceName}/fetchGroupById`,
  fetchAddGroup: `${groupsSliceName}/fetchAddGroup`,
  fetchUpdateGroup: `${groupsSliceName}/fetchUpdateGroup`,
  fetchDeleteGroup: `${groupsSliceName}/fetchDeleteGroup`,
  fetchRemoveUserFromGroup: `${groupsSliceName}/fetchRemoveUserFromGroup`,
  fetchAddUserToGroup: `${groupsSliceName}/fetchAddUserToGroup`,
};
