import { Logger, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
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
import { Namespace, Socket } from 'socket.io';
import { WsJwtGuard } from '../auth/guards';
import { SocketWithAuth } from '../auth/types';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';

@UsePipes(new ValidationPipe())
@UseGuards(WsJwtGuard)
@UseFilters(new BaseWsExceptionFilter())
@WebSocketGateway({ namespace: 'message' })
export default class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly messageService: MessageService) {}

  private readonly logger = new Logger(MessageGateway.name);

  @WebSocketServer()
  private readonly io: Namespace;

  async handleConnection(
    client: Socket & { handshake: { query: { conversationId: string } } },
  ): Promise<void> {
    try {
      client.join(client.handshake.query.conversationId);

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
      await this.messageService.createMessage(client.handshake.user.id, payload);
      client.broadcast
        .in(payload.conversationId)
        .emit('message', { clientId: client.id, content: payload.content });
    } catch (error) {
      this.logger.error(`Cannot send message to room ${payload.conversationId}`, error);
      throw new WsException('Cannot send message');
    }
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody() payload: { conversationId: string; isTyping: boolean },
  ): Promise<void> {
    try {
      client.broadcast
        .in(payload.conversationId)
        .emit('typing', { clientId: client.id, isTyping: payload.isTyping });
    } catch (error) {
      this.logger.error(`Cannot send typing to room ${payload.conversationId}`, error);
      throw new WsException('Cannot send typing');
    }
  }
}
