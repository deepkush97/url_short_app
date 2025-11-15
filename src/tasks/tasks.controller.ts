import { AppCodes } from '@app/shared/app-codes.enum';
import { AppResponse } from '@app/shared/app-response.dto';
import { IUserWithoutPasswordAndUpdatedAt } from '@app/shared/interfaces/users.interface';
import { Authenticated, CurrentUser } from '@app/shared/jwt.guard';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateTaskRequest } from './requests/create-task.request';
import { TaskResponse } from './responses/task.response';
import { TasksService } from './tasks.service';

@Authenticated()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('/')
  async createPost(
    @CurrentUser() user: IUserWithoutPasswordAndUpdatedAt,
    @Body() newPost: CreateTaskRequest,
  ): Promise<AppResponse<TaskResponse>> {
    return new AppResponse({
      code: AppCodes.TASK_CREATED,
      data: await this.tasksService.createPost({ ...newPost, userId: user.id }),
    });
  }

  @Get('/')
  async getAllPosts(
    @CurrentUser() user: IUserWithoutPasswordAndUpdatedAt,
  ): Promise<AppResponse<TaskResponse[]>> {
    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
      data: await this.tasksService.findAllByUserId(user.id),
    });
  }

  @Delete('/:taskId')
  async deletePost(
    @Param('taskId') taskId: number,
  ): Promise<AppResponse<boolean>> {
    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
      data: await this.tasksService.remove(taskId),
    });
  }
}
