import {
  OverrideNameExtractor,
  property,
  propertyType,
  serialize,
  SnakeCaseExtractor,
} from '../../src';
import { Constructor } from '../../src/base-types/constructor';
import {
  propertyValidators,
  RequiredValidator,
  StringRegexpValidator,
  validate,
  ValidationError,
  Validator,
} from '../../src/validators';

export class NotEmptyStringValidator extends Validator {
  public validate(value: any, path: string): ValidationError | undefined {
    if (typeof value !== 'string' || value.length) {
      return;
    }
    return new ValidationError('Property must be a non-empty string', path);
  }
}

export class CustomStringLengthValidator extends Validator {

  constructor(
    public minLength: number,
    public maxLength: number,
  ) {
    super();
  }

  public static with(minLength: number, maxLength: number): Constructor<CustomStringLengthValidator> {
    return class extends CustomStringLengthValidator {
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

    it('should return serializable errors', () => {

      const validationResult = validate(Test, {});
      const serializedError = serialize(validationResult[0]);
      expect(serializedError).toEqual({
        message: 'Property is required',
        path: 'property'
      });

    });

    it('should return serializable errors if property is array of serializable items', () => {

      class TestProperty {
        @property()
        @propertyValidators([RequiredValidator])
        public deepProperty: string;
      }

      class Test {
        @property()
        @propertyType(TestProperty)
        public property: TestProperty[];
      }

      const validationResult = validate(Test, {
        property: [
          {
            deepProperty: 'test1',
          },
          {},
          {},
          {
            deepProperty: 'test2',
          },
        ],
      });

      expect(validationResult[0]).toBeInstanceOf(ValidationError);
      expect(validationResult[1]).toBeInstanceOf(ValidationError);

      const serializedError1 = serialize(validationResult[0]);
      expect(serializedError1).toEqual({
        message: 'Property is required',
        path: 'property.[1].deepProperty'
      });

      const serializedError2 = serialize(validationResult[1]);
      expect(serializedError2).toEqual({
        message: 'Property is required',
        path: 'property.[2].deepProperty'
      });

    });

  });

  describe('multiple validators', () => {
    class Test {
      @property()
      @propertyValidators([NotEmptyStringValidator, CustomStringLengthValidator.with(3, 5)])
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
        @propertyValidators([NotEmptyStringValidator, CustomStringLengthValidator.with(3, 5)])
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

  describe('nested serializable objects', () => {

    it('should validate all nested serializable objects', () => {

      class Test {
        @property()
        @propertyValidators([RequiredValidator])
        public property: string;
      }
      class Test2 {
        @property()
        @propertyType(Test)
        deepNested: Test;
      }
      class Test3 {
        @property()
        @propertyType(Test2)
        nested: Test2[];
      }

      const result = validate(
        Test3,
        {
          nested: [
            {
              deepNested: {
                property: null,
              },
            },
            {
              deepNested: {
                property: '12',
              },
            },
            {
              deepNested: {
              },
            },
          ],
        },
      );

      expect(result).toEqual([
        {
          message: 'Property is required',
          path: 'nested.[0].deepNested.property',
        },
        {
          message: 'Property is required',
          path: 'nested.[2].deepNested.property',
        },
      ]);

    });

    it('should return full path of invalid property depends on extractor', () => {

      class Test {
        @property(OverrideNameExtractor.use('deep_string_property'))
        @propertyValidators([RequiredValidator])
        public stringProperty: string;
      }
      class Test2 {
        @property(SnakeCaseExtractor)
        @propertyType(Test)
        deepNested: Test;
      }
      class Test3 {
        @property(SnakeCaseExtractor)
        @propertyType(Test2)
        nestedArray: Test2[];
      }

      const result = validate(
        Test3,
        {
          nested_array: [
            {
              deep_nested: {
                deep_string_property: null,
              },
            },
            {
              deep_nested: {
                deep_string_property: '12',
              },
            },
            {
              deep_nested: {
              },
            },
          ],
        },
      );

      expect(result).toEqual([
        {
          message: 'Property is required',
          path: 'nested_array.[0].deep_nested.deep_string_property',
        },
        {
          message: 'Property is required',
          path: 'nested_array.[2].deep_nested.deep_string_property',
        },
      ]);

    });

    it('should clear error path if it has some extraction conditions', () => {

      class TestValidator extends Validator {
        public validate(value: any, path: string): ValidationError | undefined {
          return new ValidationError(
            'Property is always invalid',
            '..property1..[0].property2..',
          );
        }
      }

      class Test {
        @property()
        @propertyValidators([TestValidator])
        public property: any;
      }

      const result = validate(Test, {});
      expect(result[0].path).toBe('property1.[0].property2')

    });

  });

  it('should validate by all validators of current class and all it\'s parent', () => {

    class StringStartsWithAValidator extends Validator {
      public validate(value: any, path: string): ValidationError | undefined {
        if (typeof value !== 'string') {
          return;
        }
        if (!value.startsWith('A')) {
          return new ValidationError('Property must starts with "A"', path);
        }
      }
    }

    class Test1 {
      @property()
      @propertyValidators([NotEmptyStringValidator])
      public property: string;
    }

    class Test2 extends Test1 {
      @propertyValidators([StringStartsWithAValidator])
      public property: string;
    }

    class Test3 extends Test2 {
      @propertyValidators([StringRegexpValidator.with(/\w{3}/)])
      public property: string;
    }

    const result = validate(
      Test3,
      {
        property: '',
      },
    );

    expect(result).toEqual([
      {
        message: 'Property must be a non-empty string',
        path: 'property',
      },
      {
        message: 'Property must starts with "A"',
        path: 'property',
      },
      {
        message: 'Property does not match the regexp /\\w{3}/',
        path: 'property',
      },
    ]);

  });

  it('should not validate property without extractor', () => {

    class Test {
      @propertyValidators([RequiredValidator])
      public property: string;
    }

    const result = validate(Test, {});

    expect(result).toEqual([]);

  });

});
