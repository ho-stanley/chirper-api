import { Request } from 'express';
import { PublicUser } from './public-user';

export interface RequestWithUser extends Request {
  user: PublicUser;
}
