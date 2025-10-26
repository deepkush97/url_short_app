import { IUser } from './users.interface';

export interface IAuthJWTPayload extends Pick<IUser, 'id' | 'email'> {}
