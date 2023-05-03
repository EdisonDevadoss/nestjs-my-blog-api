import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators';

@Controller('auth')
export class AuthController {
  constructor(private authSerive: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() attrs: any) {
    return this.authSerive.signIn(attrs.email, attrs.password);
  }
}
