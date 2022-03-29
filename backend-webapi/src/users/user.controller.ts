import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  DefaultValuePipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const addedUser = await this.userService.create(createUserDto);

    return {
      message: 'user successfully created',
      user: addedUser,
    };
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedResult = await this.userService.update(id, updateUserDto);
    if (updatedResult.wasUpdated) {
      return {
        message: 'user successfully updated',
        ...updatedResult,
      };
    }
    return {
      message: `user wasn't updated`,
      wasUpdated: false,
    };
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    const res = await this.userService.remove(id);
    if (res) {
      return {
        message: `user was successfully deleted`,
        wasDeleted: true,
        id,
      };
    }
    return {
      message: `user wasn't deleted`,
      wasDeleted: false,
      id,
    };
  }
}
