import { IsDefined } from 'class-validator';

export class UserWithRelationsIdsResp {
  @IsDefined()
  id: string;

  @IsDefined()
  username: string;

  @IsDefined()
  created: Date;

  @IsDefined()
  groupId: string | null;

  @IsDefined()
  groupName: string;
}
