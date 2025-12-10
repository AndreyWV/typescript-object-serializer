import { Constructor } from '../../../utils/constructor';
import { ValidationError } from '../../core/types/validation-error';
import { Validator } from '../../core/types/validator';

/**
 * @class StringLengthValidator Validates string by length
 * @example
 * class Person extends SerializableObject {
 *
 *   @property()
 *   @propertyValidators([StringLengthValidator.with({min: 1, max: 50)])
 *   public name: string;
 *
 * }
 */
export class StringLengthValidator extends Validator {

  constructor(
    protected readonly minLength?: number,
    protected readonly maxLength?: number,
  ) {
    super();
  }

  public static with(options: { min?: number; max?: number; }): Constructor<Validator> {
    return class extends StringLengthValidator {
      constructor() {
        super(options.min, options.max);
      }
    };
  }

  public validate(value: unknown, path: string): ValidationError | undefined {
    if (typeof value !== 'string') {
      return;
    }
    return this.validateMinLength(value, path)
      ?? this.validateMaxLength(value, path);
  }

  private validateMinLength(value: string, path: string): ValidationError | undefined {
    const valueLength = value.length;
    if (Number.isInteger(this.minLength) && this.minLength! >= 0 && valueLength < this.minLength!) {
      return new ValidationError(`Property length should be greater than or equal ${this.minLength}`, path);
    }
  }

  private validateMaxLength(value: string, path: string): ValidationError | undefined {
    const valueLength = value.length;
    if (Number.isInteger(this.maxLength) && this.maxLength! >= 0 && valueLength > this.maxLength!) {
      return new ValidationError(`Property length should be less than or equal ${this.maxLength}`, path);
    }
  }
}
