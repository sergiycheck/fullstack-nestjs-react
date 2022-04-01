import { Injectable } from '@nestjs/common';
import { UserWithRelationsIdsResp } from './dto/user-responses.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserMapperService {
  mapUserFromDbToUserResponse(user: User): UserWithRelationsIdsResp {
    const { id, username, created, group, groupName } = user;

    return {
      id,
      username,
      created,
      groupName,
      groupId: group?.id ? group.id : null,
    };
  }
}
