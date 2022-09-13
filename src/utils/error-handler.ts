import { BadRequestException } from '@nestjs/common';
import {
  NotFoundError,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime';

export function prismaQueryError(e: unknown): never {
  if (e instanceof NotFoundError)
    throw new BadRequestException('Resource not found');

  if (e instanceof PrismaClientKnownRequestError) {
    if (e.code === 'P2023') throw new BadRequestException('Malformed ID');
    if (e.code === 'P2025') throw new BadRequestException('Resource not found');
  }

  throw e;
}
