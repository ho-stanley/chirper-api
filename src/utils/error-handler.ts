import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function prismaQueryError(e: unknown): never {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === 'P2023') throw new BadRequestException('Malformed ID');
    if (e.code === 'P2025') throw new BadRequestException('Resource not found');
  }

  throw e;
}
