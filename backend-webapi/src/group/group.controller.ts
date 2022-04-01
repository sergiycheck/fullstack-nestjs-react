import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto, UpdateGroupDtoRemoveOrAddUser } from './dto/update-group.dto';
import { UsersForGroupCreation } from './decorators/group-create-get-users.decorator';
import { User } from 'src/users/entities/user.entity';
import { RemoveOrAddUserToGroupResponse } from './dto/group-responses.dto';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  async create(@Body() createGroupDto: CreateGroupDto, @UsersForGroupCreation() users?: User[]) {
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
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.groupService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    const updatedResult = await this.groupService.update(id, updateGroupDto);
    if (updatedResult.wasUpdated) {
      return {
        message: 'group successfully updated',
        ...updatedResult,
      };
    }
    return {
      message: `group wasn't updated`,
      wasUpdated: false,
    };
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
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

  @Patch('remove-user-from-group/:id')
  async removeUserFromGroup(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateGroupDtoRemoveOrAddUser: UpdateGroupDtoRemoveOrAddUser,
  ) {
    if (id !== updateGroupDtoRemoveOrAddUser.id) {
      return new BadRequestException('ids are not equal');
    }

    const { userId } = updateGroupDtoRemoveOrAddUser;
    const res = (await this.groupService.removeUserFromGroup(
      userId,
    )) as RemoveOrAddUserToGroupResponse;

    if (res.success) {
      return {
        ...res,
        message: 'user was removed from group',
        userId,
        groupId: id,
      };
    }

    return {
      ...res,
      message: 'unable to remove user from group',
      userId,
      groupId: id,
    };
  }

  @Patch('add-user-to-group/:id')
  async addUserToGroup(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateGroupDtoRemoveOrAddUser: UpdateGroupDtoRemoveOrAddUser,
  ) {
    if (id !== updateGroupDtoRemoveOrAddUser.id) {
      return new BadRequestException('ids are not equal');
    }

    const { userId, id: groupId } = updateGroupDtoRemoveOrAddUser;
    const res = (await this.groupService.addUserToGroup(
      userId,
      groupId,
    )) as RemoveOrAddUserToGroupResponse;

    if (res.success) {
      return {
        ...res,
        message: 'user was assigned to group',
        userId,
        groupId: id,
      };
    }

    return {
      ...res,
      message: 'unable to assign user to group',
      userId,
      groupId: id,
    };
  }
}
