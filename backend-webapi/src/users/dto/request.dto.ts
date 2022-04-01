import { IsArray, IsNotEmpty } from 'class-validator';

export class FindUsersByIdsDto {
  @IsNotEmpty()
  @IsArray()
  userIds: string[];
}
