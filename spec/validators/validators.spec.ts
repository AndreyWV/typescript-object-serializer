import {
  ValidationError,
  Validator,
} from '../../src/validators';

export class RequiredValidator extends Validator {
  public validate(value: any, path: string): ValidationError | undefined {
    if (value === undefined || value === null) {
      return new ValidationError(`${path} is required`, path);
    }
  }
}
