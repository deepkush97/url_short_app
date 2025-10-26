import { IAuthUser } from '@app/shared/interfaces/auth-user.interface';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AuthUserResponse implements IAuthUser {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  createdAt: Date;

  @Expose()
  jwtToken: string;
}
