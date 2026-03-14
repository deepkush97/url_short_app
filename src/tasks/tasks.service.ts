import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { INewTask, ITask } from '@app/shared/interfaces/tasks/tasks.interface';

import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async createPost(taskData: INewTask & { userId: number }): Promise<Task> {
    const task = this.taskRepository.create(taskData);
    return this.taskRepository.save(task);
  }

  async findAllByUserId(userId: number): Promise<ITask[]> {
    return this.taskRepository.find({ where: { userId } });
  }

  async findOneById(id: number): Promise<ITask | null> {
    return this.taskRepository.findOne({ where: { id } });
  }

  async update(id: number, updateData: ITask): Promise<ITask> {
    await this.taskRepository.update(id, updateData);
    return this.findOneById(id);
  }

  async remove(id: number): Promise<boolean> {
    await this.taskRepository.delete(id);
    return true;
  }
}
