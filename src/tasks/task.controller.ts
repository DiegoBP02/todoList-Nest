import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './schema/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('task')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskService.createTask(createTaskDto);
  }

  @Patch('/:id')
  async updateTask(
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return await this.taskService.updateTask(taskId, updateTaskDto);
  }

  @Get()
  async getTasks(): Promise<Task[]> {
    return await this.taskService.getAllTasks();
  }

  @Get('/:id')
  async getTask(@Param('id') taskId: string): Promise<Task> {
    return await this.taskService.getTask(taskId);
  }

  @Delete('/:id')
  async deleteTask(@Param('id') taskId: string): Promise<Task> {
    return await this.taskService.deleteTask(taskId);
  }
}
