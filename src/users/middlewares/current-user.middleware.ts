import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '../users.service';
import { NextFunction, Request, Response } from 'express';
import { UserDto } from '../dto/user.dto';

type ReqType = {
  currentUser?: UserDto;
} & Request;

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserDto;
    }
  }
}

declare module 'express-session' {
  export interface SessionData {
    tokenUser?: UserDto;
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: ReqType, res: Response, next: NextFunction) {
    const { tokenUser } = req.session || {};

    if (tokenUser) {
      const user = await this.usersService.findOne(tokenUser.email);
      req.currentUser = user;
    }

    next();
  }
}
