import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { PostLoginResponse } from './dto';
import { TokenPayload, UserCredentials } from './models';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

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

  async login(user: TokenPayload): Promise<PostLoginResponse> {
    const { accessToken } = this.jwtToken(user);
    const refreshToken = this.jwtRefreshToken(user);
    await this.userService.setCurrentRefreshToken(refreshToken, user.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  private jwtToken(payload: TokenPayload): UserCredentials {
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  jwtRefreshToken(user: TokenPayload) {
    const payload = { role: user.role, id: user.id };

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.jwt.jwtRefreshSecret,
      expiresIn: `${this.configService.jwt.refreshTokenExpiration}`,
    });

    return refreshToken;
  }

  async logout(user: TokenPayload): Promise<void> {
    await this.userService.removeRefreshToken(user.id);
  }

  createAccessTokenFromRefreshToken(user: TokenPayload): UserCredentials {
    return this.jwtToken(user);
  }
}
