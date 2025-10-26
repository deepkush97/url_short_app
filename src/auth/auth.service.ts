import { AppCodes } from '@app/shared/app-codes.enum';
import { AppResponse } from '@app/shared/app-response.dto';
import { BcryptService } from '@app/shared/bcrypt/bcrypt.service';
import { IAuthJWTPayload } from '@app/shared/interfaces/auth-jwt-payload.interface';
import { IAuthUser } from '@app/shared/interfaces/auth-user.interface';
import {
  ILoginUser,
  INewUser,
  IUser,
} from '@app/shared/interfaces/users.interface';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/user.service';

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

    const data = await this.generateJwt(user);

    return new AppResponse({
      code: AppCodes.USER_CREATED,
      data,
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

    const data = await this.generateJwt(existingUser);

    return new AppResponse({
      code: AppCodes.OPERATION_SUCCESS,
      data,
    });
  }

  private async generateJwt(user: IUser): Promise<IAuthUser> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, updatedAt: __, ...rest } = user;
    const jwtPayload: IAuthJWTPayload = { id: user.id, email: user.email };
    const jwtToken = await this.jwtService.signAsync(jwtPayload);

    return {
      ...rest,
      jwtToken,
    };
  }
}
