import { Constructor } from '../../base-types/constructor';
import { ValidationError } from '../types/validation-error';
import { Validator } from '../types/validator';

export class StringLengthValidator extends Validator {

  constructor(
    protected minLength?: number,
    protected maxLength?: number,
  ) {
    super();
  }

  public static with(minLength?: number, maxLength?: number): Constructor<Validator> {
    return class extends StringLengthValidator {
      constructor() {
        super(minLength, maxLength);
      }
    }
  }

  public validate(value: any, path: string): ValidationError | undefined {
    if (typeof value !== 'string') {
      return;
    }
    const valueLength = value.length;
    if (Number.isInteger(this.minLength) && this.minLength! >= 0 && valueLength <= this.minLength!) {
      return new ValidationError(`Property length should be greater than or equal ${this.minLength}`, path);
    }
    if (Number.isInteger(this.maxLength) && this.maxLength! >= 0 && valueLength >= this.maxLength!) {
      return new ValidationError(`Property length should be less than or equal ${this.maxLength}`, path);
    }
  }
}
