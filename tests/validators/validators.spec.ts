import { NumberValueValidator } from '../../src/validators/validators/number-value';
import { StringRegexpValidator } from '../../src/validators/validators/regexp';
import { RequiredValidator } from '../../src/validators/validators/required';
import { StringLengthValidator } from '../../src/validators/validators/string-length';
import { TypeValidator } from '../../src/validators/validators/type';

describe('RequiredValidator', () => {

  it('should return validation error if value is null', () => {
    const result = new RequiredValidator().validate(null, 'property');
    expect(result).toEqual({
      message: 'Property is required',
      path: 'property',
    });
  });

  it('should return validation error if value is undefined', () => {
    const result = new RequiredValidator().validate(undefined, 'property');
    expect(result).toEqual({
      message: 'Property is required',
      path: 'property',
    });
  });

  it('should return undefined if value is empty string', () => {
    const result = new RequiredValidator().validate('', 'property');
    expect(result).toBeUndefined();
  });

  it('should return undefined if value is 0', () => {
    const result = new RequiredValidator().validate(0, 'property');
    expect(result).toBeUndefined();
  });

  it('should return undefined if value is empty object', () => {
    const result = new RequiredValidator().validate({}, 'property');
    expect(result).toBeUndefined();
  });

});

describe('StringLengthValidator', () => {

  it('should return validation error if value length is lower than minLength', () => {
    const result = new StringLengthValidator(4).validate('123', 'property');
    expect(result).toEqual({
      message: 'Property length should be greater than or equal 4',
      path: 'property',
    });
  });

  it('should return validation error if value length is greater than maxLength', () => {
    const result = new StringLengthValidator(undefined, 2).validate('123', 'property');
    expect(result).toEqual({
      message: 'Property length should be less than or equal 2',
      path: 'property',
    });
  });

  it('should return undefined if value is not string', () => {
    const result = new StringLengthValidator(2, 4).validate({}, 'property');
    expect(result).toBeUndefined();
  });

});

describe('StringRegexpValidator', () => {

  it('should return validation error if value doesn\'t match regexp', () => {
    const result = new StringRegexpValidator(/\d{1,10}/).validate('John', 'property');
    expect(result).toEqual({
      message: 'Property does not match the regexp /\\d{1,10}/',
      path: 'property',
    });
  });

  it('should return undefined if value is match regexp', () => {
    const result = new StringRegexpValidator(/\w{1,10}/).validate('John', 'property');
    expect(result).toBeUndefined();
  });

  it('should return undefined if value is not string', () => {
    const result = new StringRegexpValidator(/\w{1,10}/).validate({}, 'property');
    expect(result).toBeUndefined();
  });

});

describe('NumberValueValidator', () => {

  it('should return validation error if value is lower than min', () => {
    const result = new NumberValueValidator(10).validate(9, 'property');
    expect(result).toEqual({
      message: 'Value should be greater than or equal to 10',
      path: 'property',
    });
  });

  it('should return validation error if value is greater than max', () => {
    const result = new NumberValueValidator(undefined, 10).validate(11, 'property');
    expect(result).toEqual({
      message: 'Value should be less than or equal to 10',
      path: 'property',
    });
  });

  it('should return undefined if value is between borders', () => {
    const result = new NumberValueValidator(0, 10).validate(5, 'property');
    expect(result).toBeUndefined();
  });

  it('should return undefined if value is not number', () => {
    const result = new NumberValueValidator(0, 10).validate({}, 'property');
    expect(result).toBeUndefined();
  });

});

describe('TypeValidator', () => {

  describe('String type', () => {

    it('should return validation error if value is not string', () => {
      const result = (new (TypeValidator.String())).validate(123, 'test');
      expect(result).toEqual({
        message: 'Value must be of type String',
        path: 'test',
      });
    });

    it('should not return validation error if value is string', () => {
      const result = (new (TypeValidator.String())).validate('string value', 'test');
      expect(result).toBeUndefined();
    });

    it('should not return validation error if value is null', () => {
      const result = (new (TypeValidator.String())).validate(null, 'test');
      expect(result).toBeUndefined();
    });

    it('should not return validation error if value is undefined', () => {
      const result = (new (TypeValidator.String())).validate(undefined, 'test');
      expect(result).toBeUndefined();
    });

    it('should not return validation error if value is empty string', () => {
      const result = (new (TypeValidator.String())).validate('', 'test');
      expect(result).toBeUndefined();
    });

  });

  describe('Number type', () => {

    it('should return validation error if value is not number', () => {
      const result = (new (TypeValidator.Number())).validate('123', 'test');
      expect(result).toEqual({
        message: 'Value must be of type Number',
        path: 'test',
      });
    });

    it('should not return validation error if value is number', () => {
      const result = (new (TypeValidator.Number())).validate(123, 'test');
      expect(result).toBeUndefined();
    });

    it('should not return validation error if value is null', () => {
      const result = (new (TypeValidator.Number())).validate(null, 'test');
      expect(result).toBeUndefined();
    });

    it('should not return validation error if value is undefined', () => {
      const result = (new (TypeValidator.Number())).validate(undefined, 'test');
      expect(result).toBeUndefined();
    });

    it('should not return validation error if value is 0', () => {
      const result = (new (TypeValidator.Number())).validate(0, 'test');
      expect(result).toBeUndefined();
    });

  });

  describe('Boolean type', () => {

    it('should return validation error if value is not boolean', () => {
      const result = (new (TypeValidator.Boolean())).validate('123', 'test');
      expect(result).toEqual({
        message: 'Value must be of type Boolean',
        path: 'test',
      });
    });

    it('should not return validation error if value is boolean', () => {
      const result = (new (TypeValidator.Boolean())).validate(true, 'test');
      expect(result).toBeUndefined();
    });

    it('should not return validation error if value is null', () => {
      const result = (new (TypeValidator.Boolean())).validate(null, 'test');
      expect(result).toBeUndefined();
    });

    it('should not return validation error if value is undefined', () => {
      const result = (new (TypeValidator.Boolean())).validate(undefined, 'test');
      expect(result).toBeUndefined();
    });

    it('should not return validation error if value is false', () => {
      const result = (new (TypeValidator.Boolean())).validate(false, 'test');
      expect(result).toBeUndefined();
    });

  });

  describe('Object type', () => {

    it('should return validation error if value is not object', () => {
      const result = (new (TypeValidator.Object())).validate('123', 'test');
      expect(result).toEqual({
        message: 'Value must be of type Object',
        path: 'test',
      });
    });

    it('should not return validation error if value is object', () => {
      const result = (new (TypeValidator.Object())).validate({ test: true }, 'test');
      expect(result).toBeUndefined();
    });

    it('should not return validation error if value is null', () => {
      const result = (new (TypeValidator.Object())).validate(null, 'test');
      expect(result).toBeUndefined();
    });

    it('should not return validation error if value is undefined', () => {
      const result = (new (TypeValidator.Object())).validate(undefined, 'test');
      expect(result).toBeUndefined();
    });

    it('should not return validation error if value is empty object', () => {
      const result = (new (TypeValidator.Object())).validate({}, 'test');
      expect(result).toBeUndefined();
    });

  });


});
