import { Request } from 'express';

export interface RequestJwt extends Request {
  user: JwtData;
}

export interface JwtData {
  id: string;
  username: string;
}
