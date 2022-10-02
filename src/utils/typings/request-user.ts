import { Request } from 'express';
import { JwtData } from './request-jwt';

export interface RequestWithUser extends Request {
  user: JwtData;
}
