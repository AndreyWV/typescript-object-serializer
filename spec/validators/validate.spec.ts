import { property } from '../../src';
import { Constructor } from '../../src/base-types/constructor';
import {
  propertyValidators,
  validate,
  ValidationError,
  Validator,
} from '../../src/validators';

export class RequiredValidator extends Validator {
  public validate(value: any, path: string): ValidationError | undefined {
    if (value === undefined || value === null) {
      return new ValidationError('Property is required', path);
    }
  }
}

export class NotEmptyStringValidator extends Validator {
  public validate(value: any, path: string): ValidationError | undefined {
    if (typeof value !== 'string' || value.length) {
      return;
    }
    return new ValidationError('Property must be a non-empty string', path);
  }
}

export class StringLengthValidator extends Validator {

  constructor(
    public minLength: number,
    public maxLength: number,
  ) {
    super();
  }

  public static with(minLength: number, maxLength: number): Constructor<StringLengthValidator> {
    return class extends StringLengthValidator {
      constructor() {
        super(minLength, maxLength);
      }
    }
  }

  public validate(value: any, path: string): ValidationError | undefined {
    if (typeof value !== 'string' || value.length) {
      return;
    }
    return new ValidationError(
      `Property must be between ${this.minLength} and ${this.maxLength} characters long`,
      path,
    );
  }
}


describe('validate', () => {

  describe('basic validation', () => {

    class Test {
      @property()
      @propertyValidators([RequiredValidator])
      public property: any;
    }

    it('should return validation errors if object is invalid', () => {
      const validationResult = validate(Test, {});

      expect(validationResult).toEqual([
        new ValidationError('Property is required', 'property'),
      ]);

      expect(validationResult).toEqual([
        {
          message: 'Property is required',
          path: 'property'
        },
      ]);
    });

    it('should return empty array if object is valid', () => {
      const validationResult = validate(Test, {
        property: true,
      });
      expect(validationResult).toEqual([]);
    });

    it('should return validation error instance', () => {

      class CustomValidationError extends ValidationError { }

      class AlwaysInvalidValidator extends Validator {
        public validate(value: any, path: string): ValidationError | undefined {
          return new CustomValidationError('Property is always invalid', path);
        }
      }

      class A {
        @property()
        @propertyValidators([AlwaysInvalidValidator])
        public property: string;
      }

      const validationResult = validate(A, {});

      expect(validationResult[0]).toBeInstanceOf(CustomValidationError);

    });

  });

  describe('multiple validators', () => {
    class Test {
      @property()
      @propertyValidators([NotEmptyStringValidator, StringLengthValidator.with(3, 5)])
      public property: string;
    }

    it('should return validation errors from all validators', () => {
      const validationResult1 = validate(Test, {
        property: '',
      });

      expect(validationResult1).toEqual([
        new ValidationError('Property must be a non-empty string', 'property'),
        new ValidationError('Property must be between 3 and 5 characters long', 'property'),
      ]);
      expect(validationResult1).toEqual([
        {
          message: 'Property must be a non-empty string',
          path: 'property'
        },
        {
          message: 'Property must be between 3 and 5 characters long',
          path: 'property',
        },
      ]);
    });

  });

  describe('array validation', () => {

    it('should return error by each array element', () => {

      class Test {
        @property()
        @propertyValidators([NotEmptyStringValidator, StringLengthValidator.with(3, 5)])
        public property: string;
      }

      const validationResult = validate(
        Test,
        [
          {
            property: '123',
          },
          {
            property: '',
          },
          {
            property: '1231324',
          },
          {
            property: '',
          },
          null,
        ],
      );

      expect(validationResult).toEqual([
        new ValidationError('Property must be a non-empty string', '[1].property'),
        new ValidationError('Property must be between 3 and 5 characters long', '[1].property'),
        new ValidationError('Property must be a non-empty string', '[3].property'),
        new ValidationError('Property must be between 3 and 5 characters long', '[3].property'),
      ]);

      expect(validationResult).toEqual([
        {
          message: 'Property must be a non-empty string',
          path: '[1].property',
        },
        {
          message: 'Property must be between 3 and 5 characters long',
          path: '[1].property',
        },
        {
          message: 'Property must be a non-empty string',
          path: '[3].property',
        },
        {
          message: 'Property must be between 3 and 5 characters long',
          path: '[3].property',
        },
      ]);

    });

  });



});
