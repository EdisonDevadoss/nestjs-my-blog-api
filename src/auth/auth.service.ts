import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validatePassword(currentUser: User, password: string) {
    const isPasswordMatched = await bcrypt.compare(password, currentUser.hash);
    if (!isPasswordMatched) throw new UnauthorizedException('Invalid password');
  }

  async signIn(email: string, password: string) {
    try {
      const user = await this.usersService.getUserByEmail(email);
      await this.validatePassword(user, password);
      const token = await this.jwtService.signAsync(
        { id: user.id, email: user.email },
        {
          secret: process.env.JWT_SECRET,
        },
      );
      return {
        id: user.id,
        email: user.email,
        access_token: token,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid email or password');
    }
  }
}
