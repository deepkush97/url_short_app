import { IUser } from '../user/users.interface';

export type IAuthJWTPayload = Pick<IUser, 'id' | 'email'>;
