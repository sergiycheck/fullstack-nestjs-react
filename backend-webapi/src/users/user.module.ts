import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { UserSubscriber } from './user.subscriber';
import { GroupModule } from 'src/group/group.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => GroupModule)],
  controllers: [UserController],
  providers: [UserService, UserSubscriber],

  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
