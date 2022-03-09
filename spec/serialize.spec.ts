import { propertyType } from '../src/decorators/property-type/type';
import { property } from '../src/decorators/property/property';
import { create } from '../src/methods/create';
import { serialize } from '../src/methods/serialize';
import { SerializableObject } from '../src/serializable-object';
import { SnakeCaseExtractor } from '../src';

describe('Serialize', () => {

  describe('class without nested serializable properties', () => {

    describe('class descendant of SerializableObject', () => {

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

    describe('simple class', () => {

      class Test {
        @property()
        public stringProperty: string;

        @property()
        public numberProperty: number | null;

        public nonSerializableProperty: string;
      }

      it('should serialize data', () => {

        const instance = create(Test, {
          numberProperty: 5,
          stringProperty: 'value',
        });
        const serialized = serialize(instance);
        expect(serialized).toEqual({
          numberProperty: 5,
          stringProperty: 'value',
        });

      });

      it('should serialize null value of serializable property', () => {
        const instance = create(Test, {
          numberProperty: null,
        });
        const serialized = serialize(instance);
        expect(serialized.numberProperty).toBeNull();
      });

      it('should not apply property to serializable object if property is undefined', () => {
        const instance = create(Test, {
          numberProperty: undefined,
          stringProperty: 'test',
        });
        const serialized = serialize(instance);
        expect(serialized).toEqual({
          stringProperty: 'test',
        });
      });

      it('should not serialize non-serializable properties', () => {
        const instance = create(Test, {
          numberProperty: undefined,
          stringProperty: 'test',
          nonSerializableProperty: 'aaa',
        });
        expect(instance.nonSerializableProperty).toBe('aaa');
        const serialized = serialize(instance);
        expect(serialized.nonSerializableProperty).toBeUndefined();
      });
    });

  });

  describe('class with nested serializable property', () => {

    describe('class descendant of SerializableObject', () => {

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

    describe('simple class', () => {

      class DeepNestedProperty {
        @property()
        public property: string;
      }

      class NestedProperty {
        @property()
        public deepNestedProperty: DeepNestedProperty;
      }

      class Test {
        @property()
        public nestedProperty: NestedProperty;
      }

      it('should serialize data', () => {
        const instance = create(Test, {
          nestedProperty: {
            deepNestedProperty: {
              property: 'test',
            },
          },
        });

        const serialized = serialize(instance);
        expect(serialized).toEqual({
          nestedProperty: {
            deepNestedProperty: {
              property: 'test',
            },
          },
        });
      });

    });

  });

  describe('class with nested array of serializable items property', () => {

    describe('class descendant of SerializableObject', () => {

      class ArrayItem extends SerializableObject {
        @property(SnakeCaseExtractor)
        public valueNumber: number;
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
              valueNumber: 1,
            },
            {
              valueNumber: 3,
            },
            {
              valueNumber: 5,
            },
          ],
        });

        const serialized = instance.serialize();
        expect(serialized).toEqual({
          property: [
            {
              value_number: 1,
            },
            {
              value_number: 3,
            },
            {
              value_number: 5,
            },
          ],
        });
      });

    });

    describe('simple class', () => {

      class ArrayItem {
        @property()
        public value: number;
      }

      const defaultArray: ArrayItem[] = [];

      class Test {
        @property()
        @propertyType(ArrayItem)
        public property: ArrayItem[] = defaultArray;
      }

      describe('should serialize data', () => {
        const instance = create(Test, {
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

        const serialized = serialize(instance);
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

  it('should return empty object if object hasn\'t serializable properties', () => {

    class Test {
      public property: string;
    }

    const instance = create(Test, {
      property: 'value',
    });

    expect(serialize(instance)).toEqual({});

  });

});
