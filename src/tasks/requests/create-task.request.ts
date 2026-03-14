import { IsDateString, IsNotEmpty, MaxLength } from 'class-validator';

import { INewTask } from '@app/shared/interfaces/tasks/tasks.interface';

export class CreateTaskRequest implements INewTask {
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @IsNotEmpty()
  @MaxLength(10)
  hexColor: string;

  @IsNotEmpty()
  @IsDateString()
  dueAt: Date;
}
