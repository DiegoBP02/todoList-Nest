import { CreateTaskDto } from '../../tasks/dto/create-task.dto';
import { TaskPriority, TaskStatus } from '../../tasks/schema/task.schema';

export const CreateTaskDtoStub = (): CreateTaskDto => {
  const today = new Date();
  const fiveDaysLater = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);

  return {
    name: 'Finish project',
    priority: TaskPriority.low,
    status: TaskStatus.Incomplete,
    deadline: fiveDaysLater.toISOString(),
  };
};
