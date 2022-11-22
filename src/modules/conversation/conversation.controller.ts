import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../user/user.decorator';
import { ConversationService } from './conversation.service';
import { CreateConversationDto, GetConversationResponse } from './dto';

@UseGuards(JwtAuthGuard)
@ApiTags('conversation')
@ApiBearerAuth('access-token')
@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get('me')
  @ApiOkResponse({ type: [GetConversationResponse] })
  async getUserConversations(
    @CurrentUser('id') userId: string,
  ): Promise<GetConversationResponse[]> {
    return this.conversationService.getUserConversations(userId);
  }

  @Get(':conversationId')
  @ApiOkResponse({ type: GetConversationResponse })
  getConversationById(
    @Param('conversationId') conversationId: string,
  ): Promise<GetConversationResponse | null> {
    return this.conversationService.getConversationById(conversationId);
  }

  @Post()
  @ApiCreatedResponse({ type: GetConversationResponse })
  @ApiBody({ type: CreateConversationDto })
  async createConversation(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateConversationDto,
  ): Promise<GetConversationResponse> {
    return this.conversationService.createConversation(userId, dto.friendId);
  }
}
