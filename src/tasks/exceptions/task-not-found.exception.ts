import { HttpException, HttpStatus } from '@nestjs/common';

export class TaskNotFound extends HttpException {
  constructor() {
    super('Task not found!', HttpStatus.NOT_FOUND);
  }
}
