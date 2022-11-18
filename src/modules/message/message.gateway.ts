import { Logger, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from '../auth/guards';
import { MessageService } from './message.service';

@UseGuards(JwtAuthGuard)
@WebSocketGateway({ cors: { origin: '*' } })
export default class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(MessageGateway.name);

  @WebSocketServer()
  private readonly server: Server;

  constructor(private readonly messageService: MessageService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleConnection(client: Socket, ...args: any[]): any {
    console.log('client.handshake :>> ', client.handshake);
    this.logger.log('Client connect', client.id);
  }

  handleDisconnect(client: any): any {
    this.logger.log('Client disconnect', client.id);
  }
}
