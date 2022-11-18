import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Socket } from 'socket.io';

export class WsJwtGuard extends AuthGuard('ws-jwt') {
  constructor() {
    super();
  }

  getRequest(context: ExecutionContext): any {
    const client: Socket = context.switchToWs().getClient();
    return client.handshake;
  }
}
