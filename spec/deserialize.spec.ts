import { propertyType } from '../src/decorators/property-type/type';
import { property } from '../src/decorators/property/property';
import {
  NonArrayDataError,
  SerializableObject,
} from '../src/serializable-object';

describe('Deserialize', () => {

  describe('simple class', () => {

    class Test extends SerializableObject {
      @property()
      public stringProperty: string = 'test';

      @property()
      public numberProperty: number;

      public nonSerializableProperty: string;
    }

    it('should deserialize data', () => {

      const deserialized = Test.deserialize({
        stringProperty: 'test',
        numberProperty: 123,
      });
      expect(deserialized).toBeInstanceOf(Test);
      expect(deserialized.numberProperty).toBe(123);
      expect(deserialized.stringProperty).toBe('test');

    });

    it('should apply default value of property if it defined and value of serialized property not passed', () => {
      const deserialized = Test.deserialize({});
      expect(deserialized.stringProperty).toBe('test');
    });

    it('should apply default value of property if it defined and value of serialized property is undefined', () => {
      const deserialized = Test.deserialize({
        stringProperty: undefined,
      });
      expect(deserialized.stringProperty).toBe('test');
    });

    it('should apply null value of property if default value defined and value of serialized property passed as null', () => {
      const deserialized = Test.deserialize({
        stringProperty: null,
      });
      expect(deserialized.stringProperty).toBe(null);
    });

    it('should not deserialize non-serializable properties', () => {
      const deserialized = Test.deserialize({
        stringProperty: 'test',
        numberProperty: 123,
        nonSerializableProperty: 'aaa',
      });
      expect(deserialized.nonSerializableProperty).toBeUndefined();
    });

  });

  describe('class with nested serializable property', () => {

    class DeepNestedProperty extends SerializableObject {
      @property()
      public property: string;
    }

    class NestedProperty extends SerializableObject {
      @property()
      public deepNestedProperty: DeepNestedProperty;

      @property()
      public deepNestedPropertyWithDefaultValue: DeepNestedProperty = DeepNestedProperty.create({
        property: 'default',
      });
    }

    class Test extends SerializableObject {
      @property()
      public nestedProperty: NestedProperty;
    }

    it('should deserialize data', () => {
      const deserialized = Test.deserialize({
        nestedProperty: {
          deepNestedProperty: {
            property: '123',
          },
        },
      });

      expect(deserialized.nestedProperty.deepNestedProperty.property).toBe('123');
      expect(deserialized.nestedProperty.deepNestedProperty).toBeInstanceOf(DeepNestedProperty);
      expect(deserialized.nestedProperty).toBeInstanceOf(NestedProperty);
    });

    it('should apply default value of property if it defined and value of serialized property not passed', () => {
      const deserialized = Test.deserialize({
        nestedProperty: {}
      });
      expect(deserialized.nestedProperty.deepNestedPropertyWithDefaultValue).toBeInstanceOf(DeepNestedProperty);
      expect(deserialized.nestedProperty.deepNestedPropertyWithDefaultValue.property).toBe('default');
    });

    it('should apply null value of property if default value defined and value of serialized property passed as null', () => {
      const deserialized = Test.deserialize({
        nestedProperty: {
          deepNestedPropertyWithDefaultValue: null,
        },
      });
      expect(deserialized.nestedProperty.deepNestedPropertyWithDefaultValue).toBe(null);
    });

  });

  describe('class with nested array of serializable items property', () => {

    class ArrayItem extends SerializableObject {
      @property()
      public value: number;
    }

    const defaultArray: ArrayItem[] = [];

    class Test extends SerializableObject {
      @property()
      @propertyType(ArrayItem)
      public property: ArrayItem[] = defaultArray;
    }

    it('should deserialize data', () => {
      const deserialized = Test.deserialize({
        property: [
          {
            value: 1,
          },
          {
            value: 2,
          },
        ],
      });

      expect(deserialized.property.length).toBe(2);
      expect(deserialized.property[0]).toBeInstanceOf(ArrayItem);
      expect(deserialized.property[0].value).toBe(1);
    });

    it('should apply default value of property if it defined and value of serialized property not passed', () => {
      const deserialized = Test.deserialize({});
      expect(deserialized.property).toBe(defaultArray);
    });

    it('should apply null value of property if default value defined and value of serialized property passed as null', () => {
      const deserialized = Test.deserialize({
        property: null,
      });
      expect(deserialized.property).toBe(null);
    });

  });

  describe('class with nested array of non-serializable items property', () => {

    class Test extends SerializableObject {
      @property()
      public property: any[];
    }

    it('should deserialize array data directly', () => {
      const deserialized = Test.deserialize({
        property: [
          'test',
          {
            test: 2,
          },
        ],
      });

      expect(deserialized.property.length).toBe(2);
      expect(deserialized.property[0]).toBe('test');
      expect(deserialized.property[1].test).toBe(2);
    });

  });

  describe('array', () => {

    class Test extends SerializableObject {
      @property()
      public property: string;
    }

    it('should deserialize array of serializable items', () => {
      const deserialized = Test.deserializeArray([
        {
          property: 'test 1',
        },
        {
          property: 'test 2',
        },
      ]);
      expect(deserialized.length).toBe(2);
      expect(deserialized[0]).toBeInstanceOf(Test);
      expect(deserialized[0].property).toBe('test 1');
    });

    it('should throw error if passed non-array data', () => {

      expect(() => {
        return Test.deserializeArray({} as any);
      }).toThrowError(NonArrayDataError);

    });

  });

});
