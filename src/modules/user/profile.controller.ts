import { Controller, UseGuards, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards';
import { GetUserProfileDto } from './dto';
import { CurrentUser } from './user.decorator';

import { UserService } from './user.service';

@ApiTags('profile')
@Controller('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getMe(@CurrentUser('id') userId: string): Promise<GetUserProfileDto> {
    return this.userService.getUserProfileById(userId);
  }

  @Get(':id')
  get(@Param('id', new ParseUUIDPipe()) userId: string): Promise<GetUserProfileDto> {
    return this.userService.getUserProfileById(userId);
  }

  // @Put(':id')
  // update(
  //   @Param('id', new ParseIntPipe()) id: number,
  //   @Body() updatesUser: UserUpdate,
  // ): Promise<User> {
  //   return this.userService.update(id, updatesUser);
  // }
}
