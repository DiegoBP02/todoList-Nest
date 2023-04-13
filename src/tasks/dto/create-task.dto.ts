import { IsString, MaxLength, IsNotEmpty, IsDateString } from 'class-validator';
import { TaskPriority, TaskStatus } from '../schema/task.schema';

export class CreateTaskDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly priority: TaskPriority;

  @IsString()
  @IsNotEmpty()
  readonly status: TaskStatus;

  @IsDateString()
  @IsNotEmpty()
  readonly deadline: string;
}
