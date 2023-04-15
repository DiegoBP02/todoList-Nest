import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFound extends HttpException {
  constructor() {
    super('Invalid credentials!', HttpStatus.NOT_FOUND);
  }
}
