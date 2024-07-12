import { Constructor } from '../../base-types/constructor';
import { ValidationError } from '../types/validation-error';
import { Validator } from '../types/validator';

/**
 * @class StringLengthValidator Validates string by length
 * @example
 * class Person extends SerializableObject {
 *
 *   @property()
 *   @propertyValidators([StringLengthValidator.with(1, 50)])
 *   public name: string;
 *
 * }
 */
export class StringLengthValidator extends Validator {

  constructor(
    protected minLength?: number,
    protected maxLength?: number,
  ) {
    super();
  }

  public static with(options: { min?: number; max?: number; }): Constructor<Validator> {
    return class extends StringLengthValidator {
      constructor() {
        super(options.min, options.max);
      }
    }
  }

  public validate(value: any, path: string): ValidationError | undefined {
    if (typeof value !== 'string') {
      return;
    }
    const valueLength = value.length;
    if (Number.isInteger(this.minLength) && this.minLength! >= 0 && valueLength < this.minLength!) {
      return new ValidationError(`Property length should be greater than or equal ${this.minLength}`, path);
    }
    if (Number.isInteger(this.maxLength) && this.maxLength! >= 0 && valueLength > this.maxLength!) {
      return new ValidationError(`Property length should be less than or equal ${this.maxLength}`, path);
    }
  }
}
