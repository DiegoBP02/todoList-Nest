import {
  Controller,
  Post,
  Res,
  Body,
  Put,
  Param,
  Get,
  Delete,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Response } from 'express';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { Task } from '../schema/task.schema';
import { CreateTaskDto } from '../dto/create-task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskService.createTask(createTaskDto);
  }

  @Put('/:id')
  async updateTask(
    @Res() res: Response,
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    try {
      const task = await this.taskService.updateTask(taskId, updateTaskDto);
      return res.status(200).json(task);
    } catch (error) {
      return res
        .status(400)
        .json({ msg: 'Something went wrong!', error: error.message });
    }
  }

  @Get()
  async getTasks(@Res() res: Response) {
    try {
      const tasks = await this.taskService.getAllTasks();
      return res.status(200).json(tasks);
    } catch (error) {
      return res
        .status(400)
        .json({ msg: 'Something went wrong!', error: error.message });
    }
  }

  @Get('/:id')
  async getTask(@Param('id') taskId: string): Promise<Task> {
    const task = await this.taskService.getTask(taskId);
    return task;
  }

  @Delete('/:id')
  async deleteTask(@Res() res: Response, @Param('id') taskId: string) {
    try {
      await this.taskService.deleteTask(taskId);
      return res.status(200).json({ msg: 'Task deleted successfully!' });
    } catch (error) {
      return res
        .status(400)
        .json({ msg: 'Something went wrong!', error: error.message });
    }
  }
}
