import { ITask } from '@app/shared/interfaces/tasks/tasks.interface';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TaskResponse implements Omit<ITask, 'userId'> {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  hexColor: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  dueAt: Date;
}
