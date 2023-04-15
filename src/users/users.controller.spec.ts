import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { User, UsersSchema } from './schema/user.schema';
import { UsersService } from './users.service';
import { registerUserDtoStub } from '../test/stubs/register-user.dto.stub';
import { EmailAlreadyExists } from './exceptions/email-already-exists.exception';
import { LoginUserDto } from './dto/login-user.dto';
import { PleaseProvideAllValues } from './exceptions/please-provide-all-values.exception';
import { loginUserDtoStub } from '../test/stubs/login-user.dto';
import { UserNotFound } from './exceptions/user-not-found.exception';
import { WrongPassword } from './exceptions/wrong-password.exceptions';
import { checkPassword, hashPassword } from '../utils/password.utils';

describe('UsersController', () => {
  let userController: UsersController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let userModel: Model<User>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    userModel = mongoConnection.model(User.name, UsersSchema);
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: userModel },
      ],
    }).compile();

    userController = module.get<UsersController>(UsersController);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('Register user', () => {
    it('should throw error EmailAlreadyExists', async () => {
      await userController.register(registerUserDtoStub());
      const user = userController.register(registerUserDtoStub());
      await expect(user).rejects.toThrow(EmailAlreadyExists);
    });
    it('should create an admin account if it is the first account', async () => {
      const user = await userController.register(registerUserDtoStub());
      expect(user.role).toEqual('admin');
    });
    it('should create an user account if it is not the first account', async () => {
      await userController.register(registerUserDtoStub());
      const user = await userController.register({
        ...registerUserDtoStub(),
        email: 'randomEmail@test.com',
      });
      expect(user.role).toEqual('user');
    });
    it('should return a hashed password', async () => {
      const password = registerUserDtoStub().password;
      const hashedPassword = await hashPassword(password);
      expect(hashedPassword).not.toEqual(password);
    });
    it('should return the saved user if successful', async () => {
      const user = await userController.register(registerUserDtoStub());
      expect(user).toBeDefined();
      expect(user.email).toEqual(registerUserDtoStub().email);
    });
  });
  describe('Login user', () => {
    beforeEach(
      async () => await userController.register(registerUserDtoStub()),
    );
    it('should check if email or password is missing throw error PleaseProvideAllValues', async () => {
      const user = userController.login({} as LoginUserDto);
      await expect(user).rejects.toThrow(PleaseProvideAllValues);
    });
    it("should throw error InvalidCredentials if doesn't exists an user with the provided email", async () => {
      const user = userController.login({
        ...loginUserDtoStub(),
        email: 'randomEmail@test.com',
      });
      expect(user).rejects.toThrow(UserNotFound);
    });
    it("should throw error InvalidCredentials if password isn't correct", async () => {
      const user = userController.login({
        ...loginUserDtoStub(),
        password: 'randomPassword',
      });
      await expect(user).rejects.toThrow(WrongPassword);
    });
    it('should compare the passwords and return true', async () => {
      const password = registerUserDtoStub().password;
      const hashedPassword = await hashPassword(password);
      const isPasswordCorrect = await checkPassword(password, hashedPassword);
      expect(isPasswordCorrect).toBeTruthy();
    });
    it('should return the saved user', async () => {
      const user = await userController.login(loginUserDtoStub());
      expect(user).toBeDefined();
      expect(user.email).toEqual(registerUserDtoStub().email);
    });
  });
});
