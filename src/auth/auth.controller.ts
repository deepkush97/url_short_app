import { Body, Controller, Get, Post } from '@nestjs/common';

import { AppCodes } from '@app/shared/app-codes.enum';
import { AppResponse } from '@app/shared/app-response.dto';
import { IUserWithoutPasswordAndUpdatedAt } from '@app/shared/interfaces/users.interface';
import { Authenticated, CurrentUser } from '@app/shared/jwt.guard';

import { LoginRequest } from './requests/login.request';
import { SignupRequest } from './requests/signup.request';
import { AuthProfile, AuthProfileToken } from './responses/auth-user.response';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async handleSignup(@Body() body: SignupRequest): Promise<AppResponse<AuthProfileToken>> {
    return this.authService.signup(body);
  }

  @Post('login')
  async handleLogin(@Body() body: LoginRequest): Promise<AppResponse<AuthProfileToken>> {
    return this.authService.login(body);
  }

  @Authenticated()
  @Get('profile')
  getProfile(@CurrentUser() user: IUserWithoutPasswordAndUpdatedAt): AppResponse<AuthProfile> {
    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
      data: {
        profile: user,
      },
    });
  }
}
