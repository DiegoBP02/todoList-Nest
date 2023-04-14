import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { User, UsersSchema } from './schema/user.schema';
import { UsersService, hashPassword } from './users.service';
import { registerUserDtoStub } from '../test/stubs/register-user.dto.stub';
import { EmailAlreadyExists } from './exceptions/email-already-exists.exception';

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
    it('should return 409 - Conflict if email already in use', async () => {
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
    it('should return the saved user', async () => {
      const user = await userController.register(registerUserDtoStub());
      expect(user).toBeDefined();
      expect(user.email).toEqual(registerUserDtoStub().email);
    });
  });
});
