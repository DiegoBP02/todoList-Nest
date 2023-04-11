import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITask } from 'src/interface/task.interface';
import { CreateTaskDto } from 'src/dto/create-task.dto';
import { UpdateTaskDto } from 'src/dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel('Task') private taskModel: Model<ITask>) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<ITask> {
    const task = await this.taskModel.create(createTaskDto);
    return task;
  }

  async updateTask(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<ITask> {
    const task = await this.taskModel.findByIdAndUpdate(taskId, updateTaskDto, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      throw new NotFoundException(`Task with ${taskId} id not found!`);
    }

    return task;
  }

  async getAllTasks(): Promise<ITask[]> {
    const tasks = await this.taskModel.find();

    if (!tasks || tasks.length === 0) {
      throw new NotFoundException('No task found!');
    }

    return tasks;
  }

  async getTask(taskId: string): Promise<ITask> {
    const task = await this.taskModel.findById(taskId).exec();

    if (!task) {
      throw new NotFoundException(`Task with ${taskId} id not found!`);
    }

    return task;
  }

  async deleteTask(taskId: string): Promise<ITask> {
    const task = await this.taskModel.findByIdAndDelete(taskId);

    if (!task) {
      throw new NotFoundException(`Task with ${taskId} id not found!`);
    }

    return task;
  }
}
