export const usersSliceName = "users";

export interface User {
  id: string;
  username: string;
  created: string;
  groupId: string | null;
}
