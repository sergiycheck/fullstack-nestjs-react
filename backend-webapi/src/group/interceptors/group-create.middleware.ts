import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { UserService } from 'src/users/user.service';
import { CreateGroupDto } from '../dto/create-group.dto';

@Injectable()
export class GroupCreateMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: any, res: Response, next: NextFunction) {
    const createGroupDto = req.body as CreateGroupDto;

    const { userIds } = createGroupDto;
    if (!userIds) return next();

    const users = await this.userService.findByIds(userIds);
    if (users.length !== userIds.length)
      return next(
        new BadRequestException(
          `some ids was corrupted. some users cann't be found by provided ids ${userIds}`,
        ),
      );

    req.usersForGroupCreation = users;

    return next();
  }
}
