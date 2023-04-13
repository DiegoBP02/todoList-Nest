import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { Task } from '../schema/task.schema';
import { TaskNotFound } from '../exceptions/task-not-found.exception';
import { DeleteResultDTO } from 'src/dto/delete-result.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel('Task') private taskModel: Model<Task>) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskModel.create(createTaskDto);
  }

  async updateTask(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.taskModel.findByIdAndUpdate(taskId, updateTaskDto, {
      new: true,
      runValidators: true,
    });

    if (!task) throw new TaskNotFound();

    return task;
  }

  async getAllTasks(): Promise<Task[]> {
    const tasks = await this.taskModel.find();

    if (!tasks || tasks.length === 0) {
      throw new NotFoundException('No task found!');
    }

    return tasks;
  }

  async getTask(taskId: string): Promise<Task> {
    const task = await this.taskModel.findById(taskId).exec();

    if (!task) throw new TaskNotFound();

    return task;
  }

  async deleteTask(taskId: string): Promise<Task> {
    const task = await this.taskModel.findByIdAndDelete(taskId);

    if (!task) throw new TaskNotFound();

    return task;
  }
}
