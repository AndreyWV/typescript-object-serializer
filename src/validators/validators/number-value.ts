import { Constructor } from '../../base-types/constructor';
import { ValidationError } from '../types/validation-error';
import { Validator } from '../types/validator';

/**
 * @class NumberValueValidator Validates number between min-max values
 * @example
 * class SomeClass extends SerializableObject {
 *
 *   @property()
 *   @propertyValidators([NumberValueValidator.with({min: 0, max: Number.MAX_VALUE)])
 *   public positiveNumber: number;
 *
 * }
 */
export class NumberValueValidator extends Validator {

  constructor(
    protected min?: number,
    protected max?: number,
  ) {
    super();
  }

  public static with(options: { min?: number; max?: number; }): Constructor<Validator> {
    return class extends NumberValueValidator {
      constructor() {
        super(options.min, options.max);
      }
    }
  }

  public validate(value: any, path: string): ValidationError | undefined {
    if (typeof value !== 'number') {
      return;
    }
    if (typeof this.min === 'number' && value < this.min) {
      return new ValidationError(`Value should be greater than or equal to ${this.min}`, path);
    }
    if (typeof this.max === 'number' && value > this.max) {
      return new ValidationError(`Value should be less than or equal to ${this.max}`, path);
    }
  }
}
