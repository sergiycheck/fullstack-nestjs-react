import { OmitType } from '@nestjs/mapped-types';
import { IsDefined, IsArray } from 'class-validator';
import { UserWithRelationsIdsResp } from 'src/users/dto/user-responses.dto';

export class GroupWithRelationsIdsResp {
  @IsDefined()
  id: string;

  @IsDefined()
  name: string;

  @IsDefined()
  description: string;

  @IsDefined()
  @IsArray()
  userIds: string[];
}

export class GroupWithRelationIdsDbResponse extends OmitType(GroupWithRelationsIdsResp, [
  'userIds',
] as const) {
  @IsDefined()
  @IsArray()
  users: string[];
}

export type RemoveOrAddUserToGroupResponse =
  | {
      success: boolean;
      user: UserWithRelationsIdsResp;
    }
  | {
      success: boolean;
    };
