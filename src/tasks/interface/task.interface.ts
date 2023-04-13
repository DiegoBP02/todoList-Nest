import { Document } from 'mongoose';
import { TaskPriority, TaskStatus } from '../schema/task.schema';

export interface ITask extends Document {
  readonly name: string;
  readonly priority: TaskPriority;
  readonly status: TaskStatus;
  readonly deadline: string;
}
