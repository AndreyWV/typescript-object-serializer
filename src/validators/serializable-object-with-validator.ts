import { SerializableObject } from '../serializable-object';
import { validate } from './methods/validate';
import { ValidationError } from './types/validation-error';

export class SerializableObjectWithValidation extends SerializableObject {

  /**
   * @method validate Validates data with current class validators
   * @param data Plain object structured as current class
   * @returns { ValidationError[] } Array of validation errors (empty array if object is valid)
   */
  public static validate<T extends typeof SerializableObject>(
    this: T,
    data: any,
  ): ValidationError[] {
    return validate(this, data);
  }

}
