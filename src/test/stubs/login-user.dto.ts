import { LoginUserDto } from '../../users/dto/login-user.dto';

export const loginUserDtoStub = (): LoginUserDto => {
  return {
    email: 'test@test.com',
    password: 'secret123',
  };
};
