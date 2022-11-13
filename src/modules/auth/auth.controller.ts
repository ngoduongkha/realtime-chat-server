import { Controller, Get, HttpCode, Post, Req, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { GetRefreshResponse, LoginDto, PostLoginResponse } from './dto';
import { JwtAuthGuard, JwtRefreshGuard, LocalAuthGuard } from './guards';
import { TokenPayload } from './models';

type AuthorizedRequest = Express.RPayloadTokenequest & {
  headers: { authorization: string };
  user: TokenPayload;
};

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: LoginDto })
  @ApiResponse({ type: PostLoginResponse, status: 200 })
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  login(@Request() req: { user: TokenPayload }): Promise<PostLoginResponse> {
    const { user } = req;
    return this.authService.login(user);
  }

  @ApiResponse({ status: 200 })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logOut(@Request() req: { user: TokenPayload }) {
    await this.authService.logout(req.user);
  }

  @ApiResponse({ status: 200, type: GetRefreshResponse })
  @ApiBearerAuth('refresh-token')
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() req: AuthorizedRequest) {
    return this.authService.createAccessTokenFromRefreshToken(req.user);
  }
}
