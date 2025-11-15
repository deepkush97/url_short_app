import { IUserWithoutPasswordAndUpdatedAt } from './users.interface';

export interface IAuthProfile {
  profile: IUserWithoutPasswordAndUpdatedAt;
}

export interface IAuthProfileToken extends IAuthProfile {
  jwtToken: string;
}
