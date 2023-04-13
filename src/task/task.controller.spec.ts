import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Task, TaskSchema } from '../schema/task.schema';
import mongoose, { Connection, Model, connect } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { CreateTaskDtoStub } from '../test/stubs/create-task.dto.stub';
import { TaskDtoStub, TaskStub } from '../test/stubs/task.dto.stub';
import { TaskNotFound } from '../exceptions/task-not-found.exception';
import { NotFoundException } from '@nestjs/common';
describe('TaskController', () => {
  let taskController: TaskController;
  let taskService: TaskService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let taskModel: Model<Task>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    taskModel = mongoConnection.model(Task.name, TaskSchema);
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        TaskService,
        { provide: getModelToken(Task.name), useValue: taskModel },
      ],
    }).compile();

    taskController = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);
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
    expect(taskController).toBeDefined();
  });

  describe('Create task', () => {
    it('should return the saved object', async () => {
      const task = await taskController.createTask(CreateTaskDtoStub());
      expect(task).toBeDefined();
      expect(task.name).toEqual(CreateTaskDtoStub().name);
    });
  });

  describe('Get task', () => {
    it('should return the corresponding saved task', async () => {
      const { _id: taskId } = (await taskController.createTask(
        CreateTaskDtoStub(),
      )) as TaskStub;
      const task = (await taskController.getTask(taskId)) as TaskStub;
      expect(task._id).toEqual(taskId);
    });
    it('should return 404 - TaskNotFound', async () => {
      const randomId = new mongoose.Types.ObjectId().toString();
      const task = taskController.getTask(randomId);
      await expect(task).rejects.toThrow(TaskNotFound);
    });
  });
  describe('Get tasks', () => {
    it('should return an array with one object', async () => {
      await taskController.createTask(CreateTaskDtoStub());
      const tasks = await taskController.getTasks();
      expect(tasks.length === 1 && Array.isArray(tasks)).toBeTruthy();
    });
    it('should return the saved object', async () => {
      const { _id: taskId } = (await taskController.createTask(
        CreateTaskDtoStub(),
      )) as TaskStub;
      const tasks = (await taskController.getTasks()) as TaskStub[];
      const task = tasks[0];
      expect(task._id).toEqual(taskId);
    });
    it('should return 404 - NotFoundException', async () => {
      const tasks = taskController.getTasks();
      await expect(tasks).rejects.toThrow(NotFoundException);
    });
  });
  describe('Update task', () => {
    it('should an object with the updated name', async () => {
      const newName = { name: 'randomName' };
      const { _id: taskId } = (await taskController.createTask(
        CreateTaskDtoStub(),
      )) as TaskStub;
      const task = (await taskController.updateTask(
        taskId,
        newName,
      )) as TaskStub;
      expect(task._id).toEqual(taskId);
      expect(task.name).toEqual(newName.name);
    });
    it('should return 404 - TaskNotFound', async () => {
      const randomId = new mongoose.Types.ObjectId().toString();
      const task = taskController.getTask(randomId);
      await expect(task).rejects.toThrow(TaskNotFound);
    });
  });
  describe('Delete task', () => {
    it('should return the deleted task', async () => {
      const { _id: taskId } = (await taskController.createTask(
        CreateTaskDtoStub(),
      )) as TaskStub;
      const task = (await taskController.deleteTask(taskId)) as TaskStub;
      expect(task._id).toEqual(taskId);
    });
    it('should return 404 - TaskNotFound', async () => {
      const randomId = new mongoose.Types.ObjectId().toString();
      const task = taskController.deleteTask(randomId);
      await expect(task).rejects.toThrow(TaskNotFound);
    });
  });
});
