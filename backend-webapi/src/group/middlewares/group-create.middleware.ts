import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';

import { UserService } from 'src/users/user.service';
import { CreateGroupWithUserIdsDto } from '../dto/create-group.dto';
import { validate } from 'class-validator';

@Injectable()
export class GroupCreateMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: any, res: Response, next: NextFunction) {
    const createGroupDto = req.body as CreateGroupWithUserIdsDto;

    const errors = await validate(createGroupDto);
    if (errors.length) {
      throw new BadRequestException({ message: errors });
    }

    const { userIds } = createGroupDto;
    if (!userIds) return next();

    const users = await this.userService.findByIdsWithGroup(userIds);

    if (users.length !== userIds.length)
      return next(
        new BadRequestException(
          `some ids was corrupted. some users cann't be found by provided ids ${userIds}`,
        ),
      );

    for (const user of users) {
      if (user.group)
        return next(
          new BadRequestException({
            message: `user is assigned to other group`,
            userId: user.id,
            otherGroupId: user.group.id,
          }),
        );
    }

    users.forEach((u) => {
      delete u.group;
    });

    delete createGroupDto.userIds;
    req.usersForGroupCreation = users;

    return next();
  }
}
