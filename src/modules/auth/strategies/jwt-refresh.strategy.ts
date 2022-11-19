import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigType } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/modules/user/user.service';
import config from 'src/config';
import { RequestWithAuth, AuthPayload } from '../types';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.jwt.jwtRefreshSecret,
      passReqToCallback: true,
    });
  }

  async validate(request: RequestWithAuth, payload: AuthPayload): Promise<AuthPayload> {
    const refreshToken = request.headers.authorization?.split(' ')[1];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    const user: { id: string; refreshToken: string | null } | null =
      await this.userService.getUserIfRefreshTokenMatches(payload.id, refreshToken);

    if (!user) {
      throw new UnauthorizedException();
    }

    const { refreshToken: refreshTkn, ...rta } = user;

    return rta;
  }
}
