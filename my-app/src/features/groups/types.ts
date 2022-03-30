export const groupsSliceName = "groups";

export interface Group {
  id: string;
  name: string;
  description: string;
  userIds?: string[] | null;
}
