import { ValidationError } from '../types/validation-error';
import { Validator } from '../types/validator';

/**
 * @class RequiredValidator Validates value is not null or undefined
 *
 * @example
 * class Person extends SerializableObject {
 *
 *   @property()
 *   @propertyValidators([RequiredValidator])
 *   public name: string;
 *
 * }
 */
export class RequiredValidator extends Validator {
  public validate(value: any, path: string): ValidationError | undefined {
    if (value === undefined || value === null) {
      return new ValidationError('Property is required', path);
    }
  }
}
