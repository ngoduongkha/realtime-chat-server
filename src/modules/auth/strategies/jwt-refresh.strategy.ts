import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/database/entities';
import { UserService } from 'src/modules/user/user.service';
import { TokenPayload } from '../models';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.jwt.jwtRefreshSecret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload): Promise<User | null> {
    const refreshToken = request.headers.authorization?.split(' ')[1];

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    return this.userService.getUserIfRefreshTokenMatches(payload.id, refreshToken);
  }
}
