import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { CreateGroupDto } from './create-group.dto';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;
}

export class UpdateGroupDtoRemoveOrAddUser extends PickType(UpdateGroupDto, ['id'] as const) {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string;
}
