import { IUser } from './users.interface';

export type IAuthJWTPayload = Pick<IUser, 'id' | 'email'>;
