import { Module } from '@nestjs/common';
import { UserController } from './user.contoller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
