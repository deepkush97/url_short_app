import {
  IAuthProfile,
  IAuthProfileToken,
} from '@app/shared/interfaces/auth-user.interface';
import { IUserWithoutPasswordAndUpdatedAt } from '@app/shared/interfaces/users.interface';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AuthUserResponse implements IUserWithoutPasswordAndUpdatedAt {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  createdAt: Date;
}

@Exclude()
export class AuthProfile implements IAuthProfile {
  @Expose()
  profile: AuthUserResponse;
}

@Exclude()
export class AuthProfileToken extends AuthProfile implements IAuthProfileToken {
  @Expose()
  jwtToken: string;
}
