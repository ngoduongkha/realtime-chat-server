import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import config from 'src/config';
import { UserService } from '../user/user.service';
import { PostLoginResponse } from './dto';
import { PostSignupResponse, SignupDto } from './dto/signup.dto';
import { TokenPayload, UserCredentials } from './models';

@Injectable()
export class AuthService {
  constructor(
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<TokenPayload | null> {
    const user: {
      id: string;
      password: string;
    } | null = await this.userService.findByEmailAndGetPassword(email);

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const { password: hashedPassword, ...rta } = user;
        return rta;
      }
    }

    return null;
  }

  async signup(dto: SignupDto): Promise<PostSignupResponse> {
    const createdUser = await this.userService.create(dto);

    const accessToken = this.jwtToken({ id: createdUser.id });
    const refreshToken = this.jwtRefreshToken({ id: createdUser.id });
    await this.userService.setCurrentRefreshToken(createdUser.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(user: TokenPayload): Promise<PostLoginResponse> {
    const accessToken = this.jwtToken(user);
    const refreshToken = this.jwtRefreshToken(user);
    await this.userService.setCurrentRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  private jwtToken(user: TokenPayload): string {
    return this.jwtService.sign(user);
  }

  private jwtRefreshToken(user: TokenPayload): string {
    const refreshToken = this.jwtService.sign(user, {
      secret: this.configService.jwt.jwtRefreshSecret,
      expiresIn: parseInt(this.configService.jwt.refreshTokenExpiration, 10),
    });

    return refreshToken;
  }

  async logout(user: TokenPayload): Promise<void> {
    await this.userService.removeRefreshToken(user.id);
  }

  createAccessTokenFromRefreshToken(user: TokenPayload): UserCredentials {
    return {
      accessToken: this.jwtToken(user),
    };
  }
}
