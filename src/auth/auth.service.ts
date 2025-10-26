import { AppCodes } from '@app/shared/app-codes.enum';
import { AppResponse } from '@app/shared/app-response.dto';
import { BcryptService } from '@app/shared/bcrypt/bcrypt.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/user.service';
import { IAuthUser } from './interfaces/auth-user.interface';
import { ILoginUser, INewUser } from './interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private bcryptService: BcryptService,
    private jwtService: JwtService,
  ) {}

  async signup({
    name,
    email,
    password,
  }: INewUser): Promise<AppResponse<IAuthUser>> {
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, updatedAt: __, ...rest } = user;

    return new AppResponse({
      code: AppCodes.USER_CREATED,
      data: {
        ...rest,
        jwtToken: this.jwtService.sign({ email: user.email, sub: user.id }),
      },
    });
  }

  async login({
    email,
    password,
  }: ILoginUser): Promise<AppResponse<IAuthUser>> {
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, updatedAt: __, ...rest } = existingUser;

    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
      data: {
        ...rest,
        jwtToken: this.jwtService.sign({
          email: existingUser.email,
          sub: existingUser.id,
        }),
      },
    });
  }
}
