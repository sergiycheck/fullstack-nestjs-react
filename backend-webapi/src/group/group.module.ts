import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { GroupCreateMiddleware } from './middlewares/group-create.middleware';
import { UserModule } from 'src/users/user.module';
import { GroupMapperService } from './group-mapper.service';
@Module({
  imports: [TypeOrmModule.forFeature([Group]), forwardRef(() => UserModule)],
  controllers: [GroupController],
  providers: [GroupService, GroupMapperService],
  exports: [TypeOrmModule, GroupService],
})
export class GroupModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GroupCreateMiddleware).forRoutes({ path: 'group', method: RequestMethod.POST });
  }
}
