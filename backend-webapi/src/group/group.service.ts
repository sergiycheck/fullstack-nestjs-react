import { Inject, Injectable, InternalServerErrorException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupWithRelationIdsDbResponse } from './dto/group-responses.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';
import { GroupMapperService } from './group-mapper.service';
import { GroupWithRelationsIdsResp } from './dto/group-responses.dto';
import { UserService } from 'src/users/user.service';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private groupRepository: Repository<Group>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private groupMapper: GroupMapperService,
  ) {}

  async findAll(): Promise<GroupWithRelationsIdsResp[]> {
    const resArr = (await this.groupRepository.find({
      loadRelationIds: { relations: ['users'] },
    })) as unknown as GroupWithRelationIdsDbResponse[];

    return resArr.map(this.groupMapper.mapGroupDbFindResponseToGroupResponse);
  }

  async findOne(id: string): Promise<GroupWithRelationsIdsResp> {
    const res = (await this.groupRepository.findOne(id, {
      loadRelationIds: { relations: ['users'] },
    })) as unknown as GroupWithRelationIdsDbResponse;
    return this.groupMapper.mapGroupDbFindResponseToGroupResponse(res);
  }

  findOneWithoutRelations(id: string): Promise<Group> {
    return this.groupRepository.findOne(id);
  }

  async create(createGroupDto: CreateGroupDto, users?: User[]): Promise<GroupWithRelationsIdsResp> {
    try {
      const group = new Group(createGroupDto);
      if (users) group.users = users;
      const result = await this.groupRepository.save(group);
      await this.userService.setGroupNameForManyUsers(users, group.name);

      return this.groupMapper.mapGroupToGroupResponseWithRelationsIds(result);
    } catch (error) {
      throw new InternalServerErrorException({
        message: `can't create group  ${JSON.stringify(createGroupDto)}`,
      });
    }
  }

  async update(
    id: string,
    updateGroupDto: UpdateGroupDto,
  ): Promise<
    | {
        group: GroupWithRelationsIdsResp;
        wasUpdated: boolean;
      }
    | {
        wasUpdated: boolean;
      }
  > {
    try {
      const group = new Group(updateGroupDto);
      const result = await this.groupRepository.update(id, group);
      if (result.affected) {
        const group = await this.findOne(id);
        return {
          group,
          wasUpdated: true,
        };
      }
      return {
        wasUpdated: false,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: `can't update group with id ${id}`,
      });
    }
  }

  async remove(id: string): Promise<{
    wasDeleted: boolean;
    message: string;
  }> {
    try {
      const group = await this.findOne(id);
      if (group && group.userIds.length) {
        return {
          wasDeleted: false,
          message: `some users are assigned to this group`,
        };
      }
      const res = await this.groupRepository.delete(id);
      if (res.affected) {
        return { wasDeleted: true, message: `group was successfully deleted` };
      }
      return { wasDeleted: false, message: `group wasn't deleted` };
    } catch (error) {
      throw new InternalServerErrorException(`unable to delete group with id ${id}`);
    }
  }

  removeUserFromGroup(userId: string) {
    return this.userService.removeUserFromGroup(userId);
  }

  addUserToGroup(userId: string, groupId: string) {
    return this.userService.addUserToGroup(userId, groupId);
  }
}
