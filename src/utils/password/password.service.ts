import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  /**
   * Takes a password to salt and hash it.
   * @param password - Password to salt and hash.
   * @returns The salted and hashed password.
   */
  hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }

  /**
   * Compares if the password matches with the hashed password.
   * @param password - The password to compare with.
   * @param hashedPassword - The hashed password to compare against.
   * @returns Returns true if password matches.
   */
  comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
