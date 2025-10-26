import { ValidationErrorCode } from './validation-error-codes.enum';

export const validationErrorToValidationCodeMap: Record<
  string,
  ValidationErrorCode
> = {
  isNotEmpty: ValidationErrorCode.REQUIRED,
  maxLength: ValidationErrorCode.MAX_LENGTH,
  isEmail: ValidationErrorCode.SHOULD_BE_AN_EMAIL,
  minLength: ValidationErrorCode.MIN_LENGTH,
};
