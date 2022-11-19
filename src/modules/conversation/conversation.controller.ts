import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../user/user.decorator';
import { ConversationService } from './conversation.service';
import { GetConversationResponse } from './dto';

@UseGuards(JwtAuthGuard)
@ApiTags('conversation')
@ApiBearerAuth('access-token')
@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @ApiCreatedResponse({ type: GetConversationResponse })
  @Post(':friendId')
  async createConversation(
    @CurrentUser('id') userId: string,
    @Param('friendId') friendId: string,
  ): Promise<GetConversationResponse> {
    return this.conversationService.createConversation(userId, friendId);
  }
}
