import { ValidationError } from './validation-error';

export abstract class Validator {

  public abstract validate(value: any, path: string): ValidationError | undefined;

}
