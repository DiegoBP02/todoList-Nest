import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export enum TaskPriority {
  low = 'low',
  medium = 'medium',
  high = 'high',
}

export enum TaskStatus {
  Incomplete = 'incomplete',
  InProgress = 'in progress',
  Completed = 'completed',
}

@Schema()
export class Task {
  @Prop()
  name: string;

  @Prop({ enum: TaskPriority, default: TaskPriority.low })
  priority: string;

  @Prop({ enum: TaskStatus, default: TaskStatus.Incomplete })
  status: string;

  @Prop()
  deadline: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
