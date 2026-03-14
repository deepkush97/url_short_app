import { IBaseEntity } from '../base-entity.interface';

export interface INewTask {
  title: string;
  description: string;
  hexColor: string;
  dueAt: Date;
}

export type ITask = IBaseEntity & INewTask;
