import { OmitType } from '@nestjs/mapped-types';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGroupWithUserIdsDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  userIds: string[];
}

export class CreateGroupDto extends OmitType(CreateGroupWithUserIdsDto, ['userIds'] as const) {}
