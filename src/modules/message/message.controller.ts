import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards';
import { Message } from '../database/entities';
import { MessageService } from './message.service';

@UseGuards(JwtAuthGuard)
@ApiTags('message')
@ApiBearerAuth('access-token')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('conversation/:conversationId')
  @ApiOkResponse({ type: [Message] })
  async getMessagesByConversationId(
    @Param('conversationId') conversationId: string,
  ): Promise<Message[]> {
    return this.messageService.getMessageByConversationId(conversationId);
  }
}
