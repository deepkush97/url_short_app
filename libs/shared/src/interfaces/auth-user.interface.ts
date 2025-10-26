import { IUser } from './users.interface';

export interface IAuthUser extends Omit<IUser, 'updatedAt' | 'password'> {
  jwtToken: string;
}
