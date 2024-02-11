import { Constructor } from '../../base-types/constructor';
import { ValidationError } from '../types/validation-error';
import { Validator } from '../types/validator';

export class NumberValueValidator extends Validator {

  constructor(
    protected min?: number,
    protected max?: number,
  ) {
    super();
  }

  public static with(min?: number, max?: number): Constructor<Validator> {
    return class extends NumberValueValidator {
      constructor() {
        super(min, max);
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
