import { Document } from 'mongoose';
import { TaskPriority, TaskStatus } from 'src/schema/task.schema';

export interface ITask extends Document {
  readonly name: string;
  readonly priority: TaskPriority;
  readonly status: TaskStatus;
  readonly deadline: Date;
}
