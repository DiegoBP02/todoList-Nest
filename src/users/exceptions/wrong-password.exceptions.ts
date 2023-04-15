import { HttpException, HttpStatus } from '@nestjs/common';

export class WrongPassword extends HttpException {
  constructor() {
    super('Invalid credentials!', HttpStatus.UNAUTHORIZED);
  }
}
