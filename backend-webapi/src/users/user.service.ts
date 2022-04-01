import { Inject, Injectable, InternalServerErrorException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GroupService } from 'src/group/group.service';
import { UserMapperService } from './user-mapper.service';
import { UserWithRelationsIdsResp } from './dto/user-responses.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => GroupService))
    private groupService: GroupService,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private userMapperService: UserMapperService,
  ) {}

  async findAll(): Promise<UserWithRelationsIdsResp[]> {
    const users = (await this.usersRepository.find({
      relations: ['group'],
    })) as User[];

    return users.map(this.userMapperService.mapUserFromDbToUserResponse);
  }

  async findUsersByIds(userIds: string[]): Promise<UserWithRelationsIdsResp[]> {
    const users = (await this.usersRepository.find({
      where: { id: In([...userIds]) },
      order: { created: 'ASC' },
      relations: ['group'],
    })) as User[];

    return users.map(this.userMapperService.mapUserFromDbToUserResponse);
  }

  findByIdsWithGroup(ids: string[]): Promise<User[]> {
    return this.usersRepository.findByIds(ids, { relations: ['group'] });
  }

  async findOne(id: string): Promise<UserWithRelationsIdsResp> {
    const res = await this.usersRepository.findOne(id, {
      relations: ['group'],
    });

    return this.userMapperService.mapUserFromDbToUserResponse(res);
  }

  async remove(id: string): Promise<boolean> {
    try {
      const res = await this.usersRepository.delete(id);
      if (res.affected) {
        return true;
      }
      return false;
    } catch (error) {
      throw new InternalServerErrorException(`unable to delete user with id ${id}`);
    }
  }

  async create(createUserDto: CreateUserDto): Promise<UserWithRelationsIdsResp> {
    try {
      const { groupId } = createUserDto;
      delete createUserDto.groupId;
      const user = new User({ ...createUserDto });
      if (groupId) {
        const group = await this.groupService.findOneWithoutRelations(groupId);
        if (group) {
          user.group = group;
          user.groupName = group.name;
        }
      }
      const res = await this.usersRepository.save(user);

      return this.userMapperService.mapUserFromDbToUserResponse(res);
    } catch (error) {
      throw new InternalServerErrorException(
        { createUserDto, error },
        'This action fails to add a new user',
      );
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{ wasUpdated: boolean; user: UserWithRelationsIdsResp } | { wasUpdated: boolean }> {
    try {
      const { groupId } = updateUserDto;
      delete updateUserDto.groupId;
      const user = new User({ ...updateUserDto });
      if (groupId) {
        const group = await this.groupService.findOneWithoutRelations(groupId);
        user.group = group;
        user.groupName = group.name;
      } else if (groupId === null) {
        user.group = null;
        user.groupName = '';
      }

      const updateResult = await this.usersRepository.update(id, user);
      if (updateResult.affected) {
        const user = await this.findOne(id);
        return {
          user,
          wasUpdated: true,
        };
      }
      return {
        wasUpdated: false,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: `This action fails to update a #${id} user`,
        updateUserDto,
        error,
        wasUpdated: false,
      });
    }
  }

  async setGroupNameForManyUsers(
    users: User[],
    groupName: string,
  ): Promise<{ userId: string; affected: number }[]> {
    const results = [];
    for (const user of users) {
      const res = await this.usersRepository.update({ id: user.id }, { groupName });
      results.push({
        userId: user.id,
        affected: res.affected,
      });
    }
    return results;
  }

  async removeUserFromGroup(userId: string) {
    const res = await this.usersRepository.update({ id: userId }, { group: null, groupName: '' });
    if (res.affected) {
      const user = await this.findOne(userId);
      return {
        success: true,
        user,
      };
    }
    return {
      success: false,
    };
  }

  async addUserToGroup(userId: string, groupId: string) {
    const group = await this.groupService.findOneWithoutRelations(groupId);
    if (group) {
      const res = await this.usersRepository.update(
        { id: userId },
        { group: group, groupName: group.name },
      );
      if (res.affected) {
        const user = await this.findOne(userId);
        return {
          success: true,
          user,
        };
      }
    }
    return {
      success: false,
    };
  }
}
