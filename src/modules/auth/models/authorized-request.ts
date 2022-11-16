import { TokenPayload } from './token-payload';

export interface AuthorizedRequest extends Express.Request {
  headers: { authorization: string };
  user: TokenPayload;
}
