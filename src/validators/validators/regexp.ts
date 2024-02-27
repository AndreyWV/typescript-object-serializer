import { Constructor } from '../../base-types/constructor';
import { ValidationError } from '../types/validation-error';
import { Validator } from '../types/validator';

/**
 * @class StringRegexpValidator Validates string by regexp
 * @example Use existed class
 * class Person extends SerializableObject {
 *
 *   @property()
 *   @propertyValidators([StringRegexpValidator.with(/^[a-zA-Z\-]{1,50}$/)])
 *   public name: string;
 *
 * }
 *
 * @example Use inherited class
 * class NameValidator extends StringRegexpValidator {
 *   constructor() {
 *     super(/^[a-zA-Z\-]{1,50}$/);
 *   }
 * }
 *
 * class Person extends SerializableObject {
 *
 *   @property()
 *   @propertyValidators([NameValidator])
 *   public name: string;
 *
 * }
 */
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
