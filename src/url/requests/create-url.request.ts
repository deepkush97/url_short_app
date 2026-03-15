import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

import { INewUrl } from '@app/shared/interfaces/url/url.interface';

export class CreateUrlRequest implements INewUrl {
  @IsNotEmpty()
  @MaxLength(1000)
  url: string;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(500)
  description?: string;
}
