import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ROLES } from 'src/config';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/decorators';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Roles(ROLES.admin)
  @UseGuards(RolesGuard)
  @Get()
  listUsers() {
    return this.userService.listUsers();
  }
}
