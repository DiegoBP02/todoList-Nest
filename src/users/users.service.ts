import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UsersRole } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { EmailAlreadyExists } from './exceptions/email-already-exists.exception';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { password, email } = createUserDto;

    // temporary
    const users = await this.userModel.findOne({ email });
    if (users) {
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
}
