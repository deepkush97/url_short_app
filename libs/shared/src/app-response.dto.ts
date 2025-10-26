import { AppCodes } from './app-codes.enum';

export class AppResponse<T = unknown> {
  constructor({ data, code }: AppResponse<T>) {
    this.code = code;
    this.data = data;
  }
  data?: T;
  code: AppCodes;
}
