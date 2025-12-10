import {
  SnakeCaseExtractor,
  StraightExtractor,
} from '../src';
import { modifier } from '../src/core/decorators/modifier';
import { property } from '../src/core/decorators/property';
import { propertyType } from '../src/core/decorators/property-type';
import { create } from '../src/core/methods/create';
import { serialize } from '../src/core/methods/serialize';
import { Modifier } from '../src/core/types/modifier';
import { SerializableObject } from '../src/serializable-object';

describe('Serialize', () => {

  describe('class without nested serializable properties', () => {

    describe('class descendant of SerializableObject', () => {

      class Test extends SerializableObject {
        @property()
        public declare stringProperty: string;

        @property()
        public numberProperty?: number | null;

        public declare nonSerializableProperty: string;
      }

      it('should serialize data', () => {

        const instance = Test.create({
          numberProperty: 5,
          stringProperty: 'value',
          nonSerializableProperty: '324',
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
          stringProperty: 'value',
          nonSerializableProperty: '324',
        });
        const serialized = instance.serialize();
        expect(serialized.numberProperty).toBeNull();
      });

      it('should not include property to serializable object if property is undefined', () => {
        const instance = Test.create({
          numberProperty: undefined,
          stringProperty: 'test',
          nonSerializableProperty: '321',
        });
        const serialized = instance.serialize();
        expect(serialized).toEqual({
          stringProperty: 'test',
        });
        expect(serialized).not.toHaveProperty('numberProperty');
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

      it('should include property to serializable object if property is undefined '
        + 'but has value from modifier', () => {

          class PropertyModifier extends Modifier {
            public override onSerialize(data: unknown): unknown {
              return data === undefined
                ? null
                : data;
            }
          }

          class A extends SerializableObject {
            @property(StraightExtractor)
            @modifier(PropertyModifier)
            public declare property: string;
          }
          const instance = A.create({
            property: undefined as any,
          });
          const serialized = instance.serialize();
          expect(serialized).toEqual({
            property: null,
          });
        });

      it('should serialize array of objects without serializable type', () => {

        class Test2 extends SerializableObject {
          @property()
          public declare list: unknown[];
        }

        const instance = create(Test2, {
          list: [
            {
              property: 123,
            },
            {
              otherProperty: 'aaa',
            },
            'string value' as never,
            123,
            null as never,
          ],
        });

        const serialized = instance.serialize();
        expect(serialized).toEqual({
          list: [
            {
              property: 123,
            },
            {
              otherProperty: 'aaa',
            },
            'string value',
            123,
            null,
          ],
        });

      });
    });

    describe('simple class', () => {

      class Test {
        @property()
        public declare stringProperty: string;

        @property()
        public numberProperty?: number | null;

        public declare nonSerializableProperty: string;
      }

      it('should serialize data', () => {

        const instance = create(Test, {
          numberProperty: 5,
          stringProperty: 'value',
          nonSerializableProperty: '321',
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
          stringProperty: 'value',
          nonSerializableProperty: '321',
        });
        const serialized = serialize(instance);
        expect(serialized.numberProperty).toBeNull();
      });

      it('should not include property to serializable object if property is undefined', () => {
        const instance = create(Test, {
          numberProperty: undefined,
          stringProperty: 'test',
          nonSerializableProperty: '321',
        });
        const serialized = serialize(instance);
        expect(serialized).toEqual({
          stringProperty: 'test',
        });
        expect(serialized).not.toHaveProperty('numberProperty');
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

      it('should include property to serializable object if property is undefined '
        + 'but has value from transformer', () => {

        class PropertyModifier extends Modifier {
          public override onSerialize(data: unknown): unknown {
            return data === undefined
              ? null
              : data;
          }
        }

          class A {
            @property(StraightExtractor)
            @modifier(PropertyModifier)
            public declare property: string;
          }
          const instance = create(A, {
            property: undefined as any,
          });
          const serialized = serialize(instance);
          expect(serialized).toEqual({
            property: null,
          });
        });

      it('should serialize array of objects without serializable type', () => {

        class Test2 {
          @property()
          public declare list: unknown[];
        }

        const instance = create(Test2, {
          list: [
            {
              property: 123,
            },
            {
              otherProperty: 'aaa',
            },
            'string value' as never,
            123,
            null as never,
          ],
        });

        const serialized = serialize(instance);
        expect(serialized).toEqual({
          list: [
            {
              property: 123,
            },
            {
              otherProperty: 'aaa',
            },
            'string value',
            123,
            null,
          ],
        });

      });
    });

  });

  describe('class with nested serializable property', () => {

    describe('class descendant of SerializableObject', () => {

      class DeepNestedProperty extends SerializableObject {
        @property()
        public declare property: string;
      }

      class NestedProperty extends SerializableObject {
        @property()
        public declare deepNestedProperty: DeepNestedProperty;
      }

      class Test extends SerializableObject {
        @property()
        public declare nestedProperty: NestedProperty;
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

      it('should serialize all properties if object is extended', () => {

        class NestedPropertyExtended extends NestedProperty {
          @property()
          public declare extendedProperty: string;
        }

        const instance = Test.create({
          nestedProperty: NestedPropertyExtended.create({
            deepNestedProperty: {
              property: 'test',
            },
            extendedProperty: 'extended',
          }),
        });

        const serialized = instance.serialize();
        expect(serialized).toEqual({
          nestedProperty: {
            deepNestedProperty: {
              property: 'test',
            },
            extendedProperty: 'extended',
          },
        });
      });

    });

    describe('simple class', () => {

      class DeepNestedProperty {
        @property()
        public declare property: string;
      }

      class NestedProperty {
        @property()
        public declare deepNestedProperty: DeepNestedProperty;
      }

      class Test {
        @property()
        public declare nestedProperty: NestedProperty;
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

      it('should serialize all properties if object is extended', () => {

        class NestedPropertyExtended extends NestedProperty {
          @property()
          public declare extendedProperty: string;
        }

        const instance = create(Test, {
          nestedProperty: create(NestedPropertyExtended, {
            deepNestedProperty: {
              property: 'test',
            },
            extendedProperty: 'extended',
          }),
        });

        const serialized = serialize(instance);
        expect(serialized).toEqual({
          nestedProperty: {
            deepNestedProperty: {
              property: 'test',
            },
            extendedProperty: 'extended',
          },
        });
      });

    });

  });

  describe('class with nested array of serializable items property', () => {

    describe('class descendant of SerializableObject', () => {

      class ArrayItem extends SerializableObject {
        @property(SnakeCaseExtractor)
        public declare valueNumber: number;
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

      it('should serialize all properties if object is extended', () => {

        class ArrayItemExtended extends ArrayItem {
          @property(SnakeCaseExtractor)
          public declare extendedProperty: string;
        }

        const instance = Test.create({
          property: [
            {
              valueNumber: 1,
            },
            {
              valueNumber: 3,
            },
            ArrayItemExtended.create({
              valueNumber: 5,
              extendedProperty: 'extended',
            }),
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
              extended_property: 'extended',
            },
          ],
        });
      });

    });

    describe('simple class', () => {

      class ArrayItem {
        @property(SnakeCaseExtractor)
        public declare valueNumber: number;
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

        const serialized = serialize(instance);
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

      it('should serialize all properties if object is extended', () => {

        class ArrayItemExtended extends ArrayItem {
          @property(SnakeCaseExtractor)
          public declare extendedProperty: string;
        }

        const instance = create(Test, {
          property: [
            {
              valueNumber: 1,
            },
            {
              valueNumber: 3,
            },
            create(ArrayItemExtended, {
              valueNumber: 5,
              extendedProperty: 'extended',
            }),
          ],
        });

        const serialized = serialize(instance);
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
              extended_property: 'extended',
            },
          ],
        });
      });

    });

  });

  describe('class with nested array of non-serializable items property', () => {

    describe('class descendant of SerializableObject', () => {

      class Test extends SerializableObject {
        @property()
        public declare strings: string[];
        @property()
        public declare numbers: number[];
        @property()
        public declare booleans: boolean[];
      }

      describe('should serialize data', () => {
        const instance = Test.create({
          strings: [
            'string 1',
            'string 2',
          ],
          numbers: [
            1,
            2,
          ],
          booleans: [
            true,
            false,
          ],
        });

        const serialized = instance.serialize();
        expect(serialized).toEqual({
          strings: [
            'string 1',
            'string 2',
          ],
          numbers: [
            1,
            2,
          ],
          booleans: [
            true,
            false,
          ],
        });
      });

    });

    describe('simple class', () => {

      class Test {
        @property()
        public declare strings: string[];
        @property()
        public declare numbers: number[];
        @property()
        public declare booleans: boolean[];
      }

      describe('should serialize data', () => {
        const instance = create(Test, {
          strings: [
            'string 1',
            'string 2',
          ],
          numbers: [
            1,
            2,
          ],
          booleans: [
            true,
            false,
          ],
        });

        const serialized = serialize(instance);
        expect(serialized).toEqual({
          strings: [
            'string 1',
            'string 2',
          ],
          numbers: [
            1,
            2,
          ],
          booleans: [
            true,
            false,
          ],
        });
      });

    });

  });

  it('should return empty object if object hasn\'t serializable properties', () => {

    class Test {
      public declare property: string;
    }

    const instance = create(Test, {
      property: 'value',
    });

    expect(serialize(instance)).toEqual({});

  });

});
