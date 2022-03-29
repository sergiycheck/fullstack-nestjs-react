import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private groupRepository: Repository<Group>,
  ) {}

  findAll() {
    return this.groupRepository.find({ relations: ['users'] });
  }

  findOne(id: string) {
    return this.groupRepository.findOne(id, { relations: ['users'] });
  }

  findOneWithoutRelations(id: string) {
    return this.groupRepository.findOne(id);
  }

  async create(createGroupDto: CreateGroupDto, users?: User[]) {
    try {
      const group = new Group(createGroupDto);
      if (users) group.users = users;
      const result = await this.groupRepository.save(group);
      return result;
    } catch (error) {
      throw new InternalServerErrorException({
        message: `can't create group  ${JSON.stringify(createGroupDto)}`,
      });
    }
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
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

  async remove(id: string) {
    try {
      const group = await this.findOne(id);
      if (group && group.users.length) {
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
      throw new InternalServerErrorException(
        `unable to delete group with id ${id}`,
      );
    }
  }
}
