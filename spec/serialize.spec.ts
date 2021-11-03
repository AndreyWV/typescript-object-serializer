import { propertyType } from '../src/decorators/property-type/type';
import { property } from '../src/decorators/property/property';
import { SerializableObject } from '../src/serializable-object';

describe('Serialize', () => {

  describe('simple class', () => {

    class Test extends SerializableObject {
      @property()
      public stringProperty: string;

      @property()
      public numberProperty: number | null;

      public nonSerializableProperty: string;
    }

    it('should serialize data', () => {

      const instance = Test.create({
        numberProperty: 5,
        stringProperty: 'value',
      });
      const serialized = instance.serialize();
      expect(serialized).toEqual({
        numberProperty: 5,
        stringProperty: 'value',
      });

    });

    it('should serialize null value of serializable property', () => {
      const instance = Test.create({
        numberProperty: null,
      });
      const serialized = instance.serialize();
      expect(serialized.numberProperty).toBeNull();
    });

    it('should not apply property to serializable object if property is undefined', () => {
      const instance = Test.create({
        numberProperty: undefined,
        stringProperty: 'test',
      });
      const serialized = instance.serialize();
      expect(serialized).toEqual({
        stringProperty: 'test',
      });
    });

    it('should not serialize non-serializable properties', () => {
      const instance = Test.create({
        numberProperty: undefined,
        stringProperty: 'test',
        nonSerializableProperty: 'aaa',
      });
      expect(instance.nonSerializableProperty).toBe('aaa');
      const serialized = instance.serialize();
      expect(serialized.nonSerializableProperty).toBeUndefined();
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
    }

    class Test extends SerializableObject {
      @property()
      public nestedProperty: NestedProperty;
    }

    it('should serialize data', () => {
      const instance = Test.create({
        nestedProperty: {
          deepNestedProperty: {
            property: 'test',
          },
        },
      });

      const serialized = instance.serialize();
      expect(serialized).toEqual({
        nestedProperty: {
          deepNestedProperty: {
            property: 'test',
          },
        },
      });
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

    describe('should serialize data', () => {
      const instance = Test.create({
        property: [
          {
            value: 1,
          },
          {
            value: 3,
          },
          {
            value: 5,
          },
        ],
      });

      const serialized = instance.serialize();
      expect(serialized).toEqual({
        property: [
          {
            value: 1,
          },
          {
            value: 3,
          },
          {
            value: 5,
          },
        ],
      });
    });

  });

});
