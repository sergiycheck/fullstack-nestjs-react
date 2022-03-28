export const usersSliceName = "users";

export enum StatusData {
  loading = "loading",
  failed = "failed",
  idle = "idle",
}

export interface User {
  id: string;
  username: string;
  created: string;
}
