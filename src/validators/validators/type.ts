import { Constructor } from '../../base-types/constructor';
import { ValidationError } from '../types/validation-error';
import { Validator } from '../types/validator';

/**
 * @class TypeValidator Validates that the value is of the specified type.
 * @example
 * class SomeClass extends SerializableObject {
 *
 *   @property()
 *   @propertyValidators([TypeValidator.Number()])
 *   public numberProperty: number;
 *
 *   @property()
 *   @propertyValidators([TypeValidator.String()])
 *   public stringProperty: string;
 *
 *   @property()
 *   @propertyValidators([TypeValidator.Boolean()])
 *   public booleanProperty: boolean;
 *
 *   @property()
 *   @propertyValidators([TypeValidator.Object()])
 *   public someObjectProperty: any;
 *
 * }
 *
 * This Validator doesn't return validation error if value is empty or null.
 */
export abstract class TypeValidator extends Validator {

  protected isEmpty(value: unknown): boolean {
    return value === undefined || value === null;
  }

  public static String(): Constructor<Validator> {
    return class extends TypeValidator {
      public validate(value: any, path: string): ValidationError | undefined {
        if (this.isEmpty(value)) {
          return;
        }
        if (typeof value !== 'string') {
          return new ValidationError('Value must be of type String', path);
        }
      }
    }
  }

  public static Number(): Constructor<Validator> {
    return class extends TypeValidator {
      public validate(value: any, path: string): ValidationError | undefined {
        if (this.isEmpty(value)) {
          return;
        }
        if (typeof value !== 'number') {
          return new ValidationError('Value must be of type Number', path);
        }
      }
    }
  }

  public static Boolean(): Constructor<Validator> {
    return class extends TypeValidator {
      public validate(value: any, path: string): ValidationError | undefined {
        if (this.isEmpty(value)) {
          return;
        }
        if (typeof value !== 'boolean') {
          return new ValidationError('Value must be of type Boolean', path);
        }
      }
    }
  }

  public static Object(): Constructor<Validator> {
    return class extends TypeValidator {
      public validate(value: any, path: string): ValidationError | undefined {
        if (this.isEmpty(value)) {
          return;
        }
        if (typeof value !== 'object') {
          return new ValidationError('Value must be of type Object', path);
        }
      }
    }
  }

}
