import { Logger, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  BaseWsExceptionFilter,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { WsJwtGuard } from '../auth/guards';
import { AuthPayload, SocketWithAuth } from '../auth/types';
import { ConversationService } from '../conversation/conversation.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';

@UsePipes(new ValidationPipe())
@UseGuards(WsJwtGuard)
@UseFilters(new BaseWsExceptionFilter())
@WebSocketGateway({ namespace: 'message' })
export default class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(MessageGateway.name);

  async handleConnection(client: Socket): Promise<void> {
    try {
      const userId = this.getAuthPayload(client).id;
      const conversationIds = await this.conversationService.getUserConversationIdsByUserId(userId);

      client.join(conversationIds);

      this.logger.log('Client connected', client.id);
    } catch (ex) {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    this.logger.log('Client disconnect', client.id);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody() payload: CreateMessageDto,
  ): Promise<void> {
    try {
      const message = await this.messageService.createMessage(client.handshake.user.id, payload);
      this.conversationService.updateLastMessage(payload.conversationId, message.id);

      client.broadcast.in(payload.conversationId).emit('message', {
        userId: client.handshake.user.id,
        content: payload.content,
      });
    } catch (error) {
      this.logger.error(`Cannot send message to room ${payload.conversationId}`, error);
      throw new WsException('Cannot send message');
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody() payload: { conversationId: string; isTyping: boolean },
  ): void {
    try {
      client.broadcast
        .in(payload.conversationId)
        .emit('typing', { userId: client.handshake.user.id, isTyping: payload.isTyping });
    } catch (error) {
      this.logger.error(`Cannot send typing to room ${payload.conversationId}`, error);
      throw new WsException('Cannot send typing');
    }
  }

  private getAuthPayload(client: Socket): AuthPayload {
    const authToken = client.handshake.headers.authorization;
    const token = authToken?.split(' ')[1];

    if (!token) {
      throw new WsException('Unauthorized');
    }

    try {
      const decoded = this.jwtService.decode(token);
      return decoded as AuthPayload;
    } catch (ex) {
      throw new WsException('Invalid token');
    }
  }
}
