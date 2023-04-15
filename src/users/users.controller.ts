import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schema/user.schema';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  @Serialize(UserDto)
  // fix ts
  async register(
    @Body() createUserDto: CreateUserDto,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.usersService.register(createUserDto);
    session.tokenUser = user;
    return user;
  }

  @Post('/login')
  @Serialize(UserDto)
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.usersService.login(loginUserDto);
    session.tokenUser = user;
    return user;
  }

  @Get('/logout')
  logout(@Session() session: any) {
    session.tokenUser = null;
  }
}
