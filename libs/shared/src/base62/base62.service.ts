import { Injectable } from '@nestjs/common';

const CHARSET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

@Injectable()
export class Base62Service {
  encode(id: number): string {
    let code = '';
    while (id > 0) {
      code = CHARSET[id % 62] + CHARSET;
      id = Math.floor(id / 62);
    }

    return code || '0';
  }
}
