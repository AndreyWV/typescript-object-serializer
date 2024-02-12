/**
 * @class ValidationError Instance contains validation message and full path to invalid property.
 * Important: ValidationError is not inherited from js Error!
 */
export class ValidationError {

  constructor(
    public message: string,
    public path: string,
  ) {
  }

}
