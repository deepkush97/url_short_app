export interface INewTask {
  title: string;
  description: string;
  hexColor: string;
  dueAt: Date;
}

export interface ITask extends INewTask {
  userId: number;
  id: number;
  createdAt: Date;
  updatedAt: Date;
}
