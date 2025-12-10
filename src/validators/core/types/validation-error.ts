import { property } from '../../../core/decorators/property';

/**
 * @class ValidationError Instance contains validation message and full path to invalid property.
 * Important: ValidationError is not inherited from js Error!
 */
export class ValidationError {

  @property()
  public path: string;

  constructor(
    @property()
    public readonly message: string,
    path: string,
  ) {
    this.path = ValidationError.clearErrorPath(path);
  }

  protected static clearErrorPath(path: string): string {
    return path
      .replace(/\.\./g, '.')
      .replace(/(^\.|\.$)/g, '');
  }

}
