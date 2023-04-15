import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UsersRole } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserNotFound } from './exceptions/user-not-found.exception';
import { PleaseProvideAllValues } from './exceptions/please-provide-all-values.exception';
import { EmailAlreadyExists } from './exceptions/email-already-exists.exception';
import { WrongPassword } from './exceptions/wrong-password.exceptions';
import { checkPassword, hashPassword } from '../utils/password.utils';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new EmailAlreadyExists();
    }

    const isFirstAccount = (await this.userModel.countDocuments({})) === 0;
    const role: UsersRole = isFirstAccount ? UsersRole.admin : UsersRole.user;

    const hashedPassword = await hashPassword(password);

    return await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
      role,
    });
  }

  async login(loginUserDto: LoginUserDto): Promise<User> {
    const { email, password } = loginUserDto;

    if (!email || !password) {
      throw new PleaseProvideAllValues();
    }

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UserNotFound();
    }

    const isPasswordCorrect = await checkPassword(password, user.password);
    if (!isPasswordCorrect) {
      throw new WrongPassword();
    }

    return user;
  }
}
