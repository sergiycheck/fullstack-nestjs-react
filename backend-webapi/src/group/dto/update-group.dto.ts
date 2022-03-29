import { PartialType, OmitType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { CreateGroupDto } from './create-group.dto';

export class UpdateGroupDto extends PartialType(
  OmitType(CreateGroupDto, ['userIds'] as const),
) {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;
}
