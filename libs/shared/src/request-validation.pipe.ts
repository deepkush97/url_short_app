import {
  BadRequestException,
  Injectable,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

import { AppCodes } from './app-codes.enum';
import { AppResponse } from './app-response.dto';
import { ValidationErrorCode } from './validation-error-codes.enum';
import { validationErrorToValidationCodeMap } from './validation-error-to-code.map';

@Injectable()
export class RequestValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors = errors.reduce((acc, err) => {
          acc[err.property] = err.constraints
            ? Object.keys(err.constraints).map(
                (constraint) =>
                  validationErrorToValidationCodeMap[constraint] ??
                  ValidationErrorCode.UNKNOWN,
              )
            : [];
          return acc;
        }, {});

        return new BadRequestException(
          new AppResponse({
            code: AppCodes.BAD_REQUEST,
            data: formattedErrors,
          }),
        );
      },
    });
  }
}
