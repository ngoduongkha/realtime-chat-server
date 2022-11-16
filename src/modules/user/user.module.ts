import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfileController } from './profile.controller';
import { UserService } from './user.service';
import { Profile, User } from '../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile])],
  controllers: [ProfileController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
