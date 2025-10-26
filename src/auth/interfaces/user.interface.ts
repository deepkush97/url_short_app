export interface INewUser {
  name: string;
  email: string;
  password: string;
}

export interface IUser extends INewUser {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}
