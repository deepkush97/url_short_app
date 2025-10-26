import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AuthUserResponse {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  createdAt: Date;
}
