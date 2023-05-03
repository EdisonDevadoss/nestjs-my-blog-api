import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'login') {
  constructor(private prisma: PrismaService, configSerive: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configSerive.get('JWT_SECRET'),
    });
  }

  async validate(payload: { id: number; email: string }) {
    const user = await this.prisma.user.findFirst({
      where: { id: payload.id },
    });
    return user;
  }
}
