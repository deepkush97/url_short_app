import { AppCodes } from '@app/shared/app-codes.enum';
import { AppResponse } from '@app/shared/app-response.dto';
import { JwtAuthGuard } from '@app/shared/jwt.guard';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest } from './requests/login.request';
import { SignupRequest } from './requests/signup.request';
import { AuthUserResponse } from './responses/auth-user.response';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async handleSignup(
    @Body() body: SignupRequest,
  ): Promise<AppResponse<AuthUserResponse>> {
    return this.authService.signup(body);
  }

  @Post('login')
  async handleLogin(
    @Body() body: LoginRequest,
  ): Promise<AppResponse<AuthUserResponse>> {
    return this.authService.login(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
      data: req?.user,
    });
  }
}
