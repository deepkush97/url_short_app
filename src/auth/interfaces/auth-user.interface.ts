import { IUser } from './user.interface';

export interface IAuthUser extends Omit<IUser, 'updatedAt' | 'password'> {
  jwtToken: string;
}
