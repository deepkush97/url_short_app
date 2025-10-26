import { AppCodes } from '@app/shared/app-codes.enum';
import { AppResponse } from '@app/shared/app-response.dto';
import { BcryptService } from '@app/shared/bcrypt/bcrypt.service';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { ILoginUser, INewUser, IUser } from './interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private bcryptService: BcryptService,
  ) {}

  async signup({
    name,
    email,
    password,
  }: INewUser): Promise<AppResponse<IUser>> {
    const isExists = await this.userService.findByEmail(email);
    if (isExists) {
      return new AppResponse({ code: AppCodes.INVALID_EMAIL });
    }

    const hashedPassword = await this.bcryptService.hash(password);

    const user = await this.userService.create({
      name,
      password: hashedPassword,
      email,
    });

    return new AppResponse({
      code: AppCodes.USER_CREATED,
      data: {
        ...user,
        password: '',
      },
    });
  }

  async login({ email, password }: ILoginUser): Promise<AppResponse<IUser>> {
    const existingUser = await this.userService.findByEmail(email, {
      name: true,
      password: true,
      email: true,
      createdAt: true,
      id: true,
    });
    if (!existingUser) {
      return new AppResponse({ code: AppCodes.BAD_REQUEST });
    }

    const isValidPassword = await this.bcryptService.validate(
      password,
      existingUser.password,
    );
    if (!isValidPassword) {
      return new AppResponse({ code: AppCodes.INVALID_CREDENTIALS });
    }

    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
      data: {
        ...existingUser,
        password: '',
      },
    });
  }
}
