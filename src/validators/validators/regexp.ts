import { Constructor } from '../../base-types/constructor';
import { ValidationError } from '../types/validation-error';
import { Validator } from '../types/validator';

export class StringRegexpValidator extends Validator {

  constructor(
    protected regexp: RegExp,
  ) {
    super();
  }

  public static with(regexp: RegExp): Constructor<Validator> {
    return class extends StringRegexpValidator {
      constructor() {
        super(regexp);
      }
    }
  }

  public validate(value: any, path: string): ValidationError | undefined {
    if (typeof value !== 'string') {
      return;
    }
    if (!this.regexp.test(value)) {
      return new ValidationError(`Property does not match the regexp ${this.regexp}`, path);
    }
  }
}
