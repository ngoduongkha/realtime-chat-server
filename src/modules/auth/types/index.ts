import { Socket } from 'socket.io';
import { Request } from 'express';
import { Handshake } from 'socket.io/dist/socket';

export type AuthPayload = {
  id: string;
};

export type RequestWithAuth = Request & { user: AuthPayload };
export type SocketWithAuth = Socket & {
  handshake: Handshake & { user: AuthPayload };
};

export type UserCredentials = {
  accessToken: string;
  refreshToken?: string;
};
