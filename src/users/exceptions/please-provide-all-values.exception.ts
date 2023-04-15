import { HttpException, HttpStatus } from '@nestjs/common';

export class PleaseProvideAllValues extends HttpException {
  constructor() {
    super('Please provide all values!', HttpStatus.BAD_REQUEST);
  }
}
