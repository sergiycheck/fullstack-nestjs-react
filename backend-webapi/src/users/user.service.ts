import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GroupService } from 'src/group/group.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private groupService: GroupService,
  ) {}

  async findAll() {
    const users = await this.usersRepository.find({ relations: ['group'] });
    return users;
  }

  findByIds(ids: string[]) {
    return this.usersRepository.findByIds(ids);
  }

  findOne(id: string) {
    return this.usersRepository.findOne(id, { relations: ['group'] });
  }

  async remove(id: string) {
    try {
      const res = await this.usersRepository.delete(id);
      if (res.affected) {
        return true;
      }
      return false;
    } catch (error) {
      throw new InternalServerErrorException(
        `unable to delete user with id ${id}`,
      );
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const result = await this.usersRepository.save(createUserDto);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        { createUserDto, error },
        'This action fails to add a new user',
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const { groupId } = updateUserDto;
      delete updateUserDto.groupId;
      const user = new User(updateUserDto);
      if (groupId) {
        const group = await this.groupService.findOneWithoutRelations(groupId);
        user.group = group;
      } else if (groupId === null) {
        user.group = null;
      }

      const updateResult = await this.usersRepository.update(id, user);
      if (updateResult.affected) {
        const user = await this.usersRepository.findOne(id);
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
}
