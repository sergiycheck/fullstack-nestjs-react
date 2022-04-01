import { usersSliceName } from "./types";

export const thunkTypes = {
  fetchUsers: `${usersSliceName}/fetchUsers`,
  fetchUsersByIdsAndUpdateAsync: `${usersSliceName}/fetchUsersByIdsAndUpdateAsync`,
  fetchUserById: `${usersSliceName}/fetchUserById`,
  fetchAddUser: `${usersSliceName}/fetchAddUser`,
  fetchUpdateUser: `${usersSliceName}/fetchUpdateUser`,
  fetchDeleteUser: `${usersSliceName}/fetchDeleteUser`,
};
