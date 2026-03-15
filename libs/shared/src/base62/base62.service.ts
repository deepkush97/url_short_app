import { Injectable } from '@nestjs/common';

@Injectable()
export class Base62Service {
  private readonly CHARSET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private readonly LENGTH = 8;
  private readonly SALT = 123456789;

  encode(id: number): string {
    let shuffled = (id ^ this.SALT) * 0x45d9f3b;
    shuffled = (shuffled ^ (shuffled >>> 16)) * 0x45d9f3b;
    shuffled = (shuffled ^ (shuffled >>> 16)) >>> 0;

    let result = '';

    while (shuffled > 0) {
      result = this.CHARSET[shuffled % 62] + result;
      shuffled = Math.floor(shuffled / 62);
    }

    return result.padStart(this.LENGTH, '0');
  }
}
