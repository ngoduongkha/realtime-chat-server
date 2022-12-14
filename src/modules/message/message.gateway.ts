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
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from '../auth/guards';
import { AuthPayload, SocketWithAuth } from '../auth/types';
import { ConversationService } from '../conversation/conversation.service';
import { UserService } from '../user/user.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';

@UsePipes(new ValidationPipe())
@UseGuards(WsJwtGuard)
@UseFilters(new BaseWsExceptionFilter())
@WebSocketGateway({ namespace: 'message' })
export default class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(MessageGateway.name);

  async handleConnection(client: Socket): Promise<void> {
    try {
      const userId = this.getAuthPayload(client).id;
      const conversationIds = await this.conversationService.getUserConversationIdsByUserId(userId);

      client.join(conversationIds);
      client.in(conversationIds).emit('online', { userId, isOnline: true });

      await this.userService.updateOnline(userId, true);

      this.logger.log('Client connected', client.id);
    } catch (ex) {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const userId = this.getAuthPayload(client).id;
    const conversationIds = await this.conversationService.getUserConversationIdsByUserId(userId);

    client.in(conversationIds).emit('online', { userId, isOnline: false });
    await this.userService.updateOnline(userId, false);

    this.logger.log('Client disconnect', client.id);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody() payload: CreateMessageDto,
  ): Promise<void> {
    try {
      const { content, replyToId, conversationId } = payload;
      const { id: userId } = client.handshake.user;

      const { id } = await this.messageService.createMessage(userId, payload);
      this.conversationService.updateLastMessage(conversationId, id);

      this.server.to(conversationId).emit('message', {
        id,
        userId,
        content,
        replyToId,
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
