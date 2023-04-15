import { CreateUserDto } from '../../users/dto/create-user.dto';

export const registerUserDtoStub = (): CreateUserDto => {
  return {
    name: 'test',
    email: 'test@test.com',
    password: 'secret123',
  };
};
