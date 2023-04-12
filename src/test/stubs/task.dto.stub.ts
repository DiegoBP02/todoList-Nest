import { Task } from 'src/schema/task.schema';
import { CreateTaskDtoStub } from './create-task.dto.stub';

export interface TaskStub extends Task {
  _id: string;
}

export const TaskDtoStub = (): TaskStub => {
  return {
    ...CreateTaskDtoStub(),
    _id: expect.any(Number),
  };
};
