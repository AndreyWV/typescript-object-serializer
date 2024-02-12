import { ValidationError } from './validation-error';

/**
 * @class Validator Basic class of validator
 * Extend this class with required implementation of `validate` method to validate data
 * `validate` method should return:
 *   1. ValidationError class instance if data is invalid
 *   2. `undefined` if data is valid
 */
export abstract class Validator {

  public abstract validate(value: any, path: string): ValidationError | undefined;

}
