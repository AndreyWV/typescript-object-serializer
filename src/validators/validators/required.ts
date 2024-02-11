import { ValidationError } from '../types/validation-error';
import { Validator } from '../types/validator';

export class RequiredValidator extends Validator {
  public validate(value: any, path: string): ValidationError | undefined {
    if (value === undefined || value === null) {
      return new ValidationError('Property is required', path);
    }
  }
}
