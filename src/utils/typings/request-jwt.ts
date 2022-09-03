import { Role } from '@prisma/client';
import { Request } from 'express';

export interface RequestJwt extends Request {
  user: JwtData;
}

export interface JwtData {
  id: string;
  username: string;
  role: Role;
}
