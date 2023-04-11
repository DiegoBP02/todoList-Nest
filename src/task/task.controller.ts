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
import { CreateTaskDto } from 'src/dto/create-task.dto';
import { Response } from 'express';
import { UpdateTaskDto } from 'src/dto/update-task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(@Res() res: Response, @Body() createTaskDto: CreateTaskDto) {
    try {
      const task = await this.taskService.createTask(createTaskDto);
      return res.status(201).json(task);
    } catch (error) {
      return res
        .status(400)
        .json({ msg: 'Something went wrong!', error: error.message });
    }
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
  async getTask(@Res() res: Response, @Param('id') taskId: string) {
    try {
      const task = await this.taskService.getTask(taskId);
      return res.status(200).json(task);
    } catch (error) {
      return res
        .status(400)
        .json({ msg: 'Something went wrong!', error: error.message });
    }
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
