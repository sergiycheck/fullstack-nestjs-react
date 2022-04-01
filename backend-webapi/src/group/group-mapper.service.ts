import { Injectable } from '@nestjs/common';
import {
  GroupWithRelationIdsDbResponse,
  GroupWithRelationsIdsResp,
} from './dto/group-responses.dto';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupMapperService {
  mapGroupToGroupResponseWithRelationsIds(group: Group): GroupWithRelationsIdsResp {
    const { id, name, description, users } = group;
    return {
      id,
      name,
      description,
      userIds: users.length ? users.map((u) => u.id) : [],
    };
  }

  mapGroupDbFindResponseToGroupResponse(
    group: GroupWithRelationIdsDbResponse,
  ): GroupWithRelationsIdsResp {
    const { id, name, description, users } = group;
    return {
      id,
      name,
      description,
      userIds: users,
    };
  }
}
