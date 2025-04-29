import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  protected flattenValidationErrors(errors: ValidationError[]): string[] {
    return errors.map((error) => Object.values(error.constraints).join(', '));
  }

  createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      const errors = this.flattenValidationErrors(validationErrors);
      const message = errors.join('; ');
      return new BadRequestException(message);
    };
  }
}
