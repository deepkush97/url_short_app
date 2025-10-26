import { Exclude, Expose } from 'class-transformer';
import { IAuthUser } from '../interfaces/auth-user.interface';

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
