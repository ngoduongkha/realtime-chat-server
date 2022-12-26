import { Controller, UseGuards, Get, Param, ParseUUIDPipe, Query, Body, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PageDto, PageOptionsDto } from 'src/common/dto';
import { JwtAuthGuard } from '../auth/guards';
import { ApiPaginatedResponse, CurrentUser } from '../../common/decorators';
import { UserService } from './user.service';
import { EditProfileDto, GetUserResponse } from './dto';

@ApiTags('profile')
@Controller('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiPaginatedResponse(GetUserResponse)
  index(@Query() pageOptions: PageOptionsDto): Promise<PageDto<GetUserResponse>> {
    return this.userService.getUsers(pageOptions);
  }

  @ApiOkResponse({ type: GetUserResponse })
  @Get('me')
  getMe(@CurrentUser('id') userId: string): Promise<GetUserResponse> {
    return this.userService.getUserProfileById(userId);
  }

  @ApiOkResponse({ type: GetUserResponse })
  @Get(':id')
  getById(@Param('id', new ParseUUIDPipe()) userId: string): Promise<GetUserResponse> {
    return this.userService.getUserProfileById(userId);
  }

  @Put()
  @ApiBody({ type: EditProfileDto })
  @ApiOkResponse({ type: GetUserResponse })
  update(@CurrentUser('id') id: string, @Body() dto: EditProfileDto): Promise<GetUserResponse> {
    return this.userService.update(id, dto);
  }
}
