import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: string) {
    return this.usersRepository.findOne(id);
  }

  async remove(id: string) {
    const res = await this.usersRepository.delete(id);
    if (res.affected) {
      return true;
    }
    return false;
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const result = await this.usersRepository.save(createUserDto);
      return result;
    } catch (error) {
      return (
        'This action fails to add a new user' +
        `${JSON.stringify(createUserDto)} \n` +
        `${JSON.stringify(error)}`
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const updateResult = await this.usersRepository.update(id, updateUserDto);
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
      return {
        message:
          `This action fails to update a #${id} user` +
          `${JSON.stringify(updateUserDto)} \n` +
          `${JSON.stringify(error)}`,
        wasUpdated: false,
      };
    }
  }
}
