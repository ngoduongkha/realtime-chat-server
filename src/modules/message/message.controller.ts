import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards';
import { GetMessageResponse } from './dto';
import { MessageService } from './message.service';

@UseGuards(JwtAuthGuard)
@ApiTags('Message')
@ApiBearerAuth('access-token')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('conversation/:conversationId')
  @ApiOkResponse({ type: [GetMessageResponse] })
  async getMessagesByConversationId(
    @Param('conversationId') conversationId: string,
  ): Promise<GetMessageResponse[]> {
    return this.messageService.getMessageByConversationId(conversationId);
  }
}
