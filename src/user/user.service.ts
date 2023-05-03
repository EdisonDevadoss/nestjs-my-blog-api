import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });
    if (!user) throw new UnauthorizedException('No user found');
    return user;
  }

  findByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }

  listUsers() {
    return this.prisma.user.findMany();
  }
}
