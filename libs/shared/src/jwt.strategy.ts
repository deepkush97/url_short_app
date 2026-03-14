import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/user/user.service';

import { IAuthJWTPayload } from './interfaces/auth-jwt-payload.interface';
import { IUserWithoutPasswordAndUpdatedAt } from './interfaces/users.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: IAuthJWTPayload): Promise<IUserWithoutPasswordAndUpdatedAt> {
    const user = await this.userService.findOneById(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }

    const { password: _, updatedAt: __, ...rest } = user;
    return { ...rest };
  }
}
