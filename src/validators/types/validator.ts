import { ValidationError } from './validation-error';

export abstract class Validator {

  public abstract code: string;

  public abstract validate(value: any): ValidationError;

}
