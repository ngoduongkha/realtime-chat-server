import { Logger, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  BaseWsExceptionFilter,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { WsJwtGuard } from '../auth/guards';
import { AuthPayload, SocketWithAuth } from '../auth/types';
import { ConversationService } from '../conversation/conversation.service';
import { InformationService } from '../information/information.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';

@UsePipes(new ValidationPipe())
@UseGuards(WsJwtGuard)
@UseFilters(new BaseWsExceptionFilter())
@WebSocketGateway({ namespace: 'message' })
export default class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(MessageGateway.name);

  @WebSocketServer()
  private readonly io: Namespace;

  constructor(
    private readonly jwtService: JwtService,
    private readonly messageService: MessageService,
    private readonly informationService: InformationService,
    private readonly conversationService: ConversationService,
  ) {}

  afterInit(): void {
    this.logger.log('Message Gateway initialized.');
  }

  async handleConnection(client: Socket): Promise<void> {
    try {
      const user = this.getAuthPayload(client);

      await this.informationService.upsert({ userId: user.id, socketId: client.id });

      this.logger.log('Client connected', client.id);
    } catch (ex) {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const user = this.getAuthPayload(client);

    await this.informationService.delete(user.id);

    this.logger.log('Client disconnect', client.id);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: SocketWithAuth,
    payload: CreateMessageDto,
  ): Promise<void> {
    this.messageService.createMessage(client.handshake.user.id, payload);
  }

  private getAuthPayload(client: Socket): AuthPayload {
    const authPayload = client.handshake.headers.authorization ?? '';

    if (!authPayload) {
      this.logger.error('Token not provided');
      throw new Error('Token not provided');
    }

    const [method, token] = authPayload.split(' ');

    if (method !== 'Bearer') {
      this.logger.error('Invalid authentication method. Only Bearer is supported.');
      throw new Error('Invalid authentication method. Only Bearer is supported.');
    }

    try {
      const decoded = this.jwtService.verify<AuthPayload>(token);
      return decoded;
    } catch (ex) {
      this.logger.error('Invalid token');
      throw new Error('Invalid token');
    }
  }
}
