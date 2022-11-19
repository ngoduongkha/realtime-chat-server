import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  GetRefreshResponse,
  LoginDto,
  PostLoginResponse,
  PostSignupResponse,
  SignupDto,
} from './dto';
import { JwtAuthGuard, JwtRefreshGuard, LocalAuthGuard } from './guards';
import { RequestWithAuth } from './types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: PostLoginResponse })
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Request() req: RequestWithAuth): Promise<PostLoginResponse> {
    return this.authService.login(req.user);
  }

  @ApiBody({ type: SignupDto })
  @ApiCreatedResponse({ type: PostSignupResponse })
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup(@Body() dto: SignupDto): Promise<PostSignupResponse> {
    return this.authService.signup(dto);
  }

  @ApiOkResponse()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logOut(@Request() req: RequestWithAuth): Promise<void> {
    await this.authService.logout(req.user);
  }

  @ApiOkResponse({ type: GetRefreshResponse })
  @ApiBearerAuth('refresh-token')
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() req: RequestWithAuth): GetRefreshResponse {
    return this.authService.createAccessTokenFromRefreshToken(req.user);
  }
}
