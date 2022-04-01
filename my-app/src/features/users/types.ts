export const usersSliceName = "users";

export interface User {
  id: string;
  username: string;
  created: string;
  groupId: string | null;
  groupName: string | null;
}

export type UserUpdateRequest = Omit<User, "created">;

export type UpdateUserResponse = {
  message: string;
  user: User;
  wasUpdated: boolean;
};

export type DeleteResponse = {
  message: string;
  wasDeleted: boolean;
  id: User["id"];
};

export type CreateUserRequest = {
  username: string;
  groupId?: string;
};

export type CreateUserResponse = {
  user: User;
  message: string;
};
