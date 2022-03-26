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

  findOne(id: number) {
    return this.usersRepository.findOne(id);
  }

  async remove(id: number) {
    return this.usersRepository.delete(id);
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

  update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const updateResult = this.usersRepository.update(id, updateUserDto);
      return updateResult;
    } catch (error) {
      return (
        `This action fails to update a #${id} user` +
        `${JSON.stringify(updateUserDto)} \n` +
        `${JSON.stringify(error)}`
      );
    }
  }
}
