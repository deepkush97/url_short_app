import { AppResponse } from '@app/shared/app-response.dto';
import { Body, Controller, Post } from '@nestjs/common';
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
}
