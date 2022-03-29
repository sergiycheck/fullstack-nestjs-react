import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { UsersForGroupCreation } from './decorators/group-create-get-users.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  async create(
    @Body() createGroupDto: CreateGroupDto,
    @UsersForGroupCreation() users?: User[],
  ) {
    const addedGroup = await this.groupService.create(createGroupDto, users);
    return {
      message: 'group successfully created',
      group: addedGroup,
    };
  }

  @Get()
  findAll() {
    return this.groupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(id, updateGroupDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleteResult = await this.groupService.remove(id);

    if (deleteResult.wasDeleted) {
      return {
        ...deleteResult,
        id,
      };
    }
    return {
      ...deleteResult,
      id,
    };
  }
}
