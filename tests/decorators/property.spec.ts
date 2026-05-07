import { propertyType } from '../../src';
import { OverrideNameExtractor } from '../../src/common/extractors/override-name-extractor';
import {
  NotStringPropertyKeyError,
  SnakeCaseExtractor,
} from '../../src/common/extractors/snake-case-extractor';
import { StraightExtractor } from '../../src/common/extractors/straight-extractor';
import { modifier } from '../../src/core/decorators/modifier';
import { property } from '../../src/core/decorators/property';
import { create } from '../../src/core/methods/create';
import { deserialize } from '../../src/core/methods/deserialize';
import { serialize } from '../../src/core/methods/serialize';
import { Modifier } from '../../src/core/types/modifier';
import { SerializableObject } from '../../src/serializable-object';

describe('Decorator @property', () => {

  describe('class descendant of SerializableObject', () => {

    describe('without extractor (default Straight Extractor)', () => {

      class Test extends SerializableObject {

        @property()
        public declare test: string;

      }

      it('should serialize property to same property key', () => {

        const instance = Test.create({
          test: 'aaa',
        });

        const serialized = instance.serialize();
        expect(serialized.test)
          .toBe('aaa');

      });

      it('should deserialize property to same property key', () => {

        const deserialized = Test.deserialize({
          test: 'aaa',
        });
        expect(deserialized.test)
          .toBe('aaa');

      });

    });

    describe('with Straight Extractor', () => {

      describe('with value transformation', () => {

        class TestModifier extends Modifier {

          public override onSerialize(value: number): unknown {

            return value && String(value);

          }

          public override onDeserialize(value: unknown): number | undefined {

            return value
              ? Number(value)
              : undefined;

          }

        }

        class Test extends SerializableObject {

          @property(StraightExtractor)
          @modifier(TestModifier)
          public declare test: number;

        }

        it('should transform property on serialize', () => {

          const instance = Test.create({
            test: 123,
          });

          const serialized = instance.serialize();
          expect(serialized.test)
            .toBe('123');

        });

        it('should transform property on deserialize', () => {

          const deserialized = Test.deserialize({
            test: '123',
          });
          expect(deserialized.test)
            .toBe(123);

        });

      });

    });

    describe('with extractor camelCase', () => {

      class Test extends SerializableObject {

        @property(SnakeCaseExtractor)
        public declare testProperty: string;

      }

      it('should serialize property to snake_case transformed property key', () => {

        const instance = Test.create({
          testProperty: 'aaa',
        });

        const serialized = instance.serialize();
        expect(serialized.test_property)
          .toBe('aaa');
        expect(serialized).not.toHaveProperty('testProperty');

      });

      it('should deserialize property to camelCase transformed property key', () => {

        const deserialized = Test.deserialize({
          test_property: 'aaa',
        });
        expect(deserialized.testProperty)
          .toBe('aaa');
        expect(deserialized).not.toHaveProperty('test_property');

      });

      it('should throw error if property decorator assigned to non-string property key', () => {

        const symbolKey = Symbol('property');

        class Test2 {

          @property(SnakeCaseExtractor)
          public [symbolKey]?: string;

        }

        expect(() => {

          deserialize(Test2, {});

        })
          .toThrow(
            new NotStringPropertyKeyError(symbolKey),
          );

      });

      describe('with value transformation', () => {

        class TestModifier extends Modifier {

          public override onSerialize(value: number): unknown {

            return value && String(value);

          }

          public override onDeserialize(value: unknown): number | undefined {

            return value
              ? Number(value)
              : undefined;

          }

        }

        class Test2 extends SerializableObject {

          @property(SnakeCaseExtractor)
          @modifier(TestModifier)
          public declare testProperty: number;

        }

        it('should transform property on serialize', () => {

          const instance = Test2.create({
            testProperty: 123,
          });

          const serialized = instance.serialize();
          expect(serialized.test_property)
            .toBe('123');

        });

        it('should transform property on deserialize', () => {

          const deserialized = Test2.deserialize({
            test_property: '123',
          });
          expect(deserialized.testProperty)
            .toBe(123);

        });

      });

      describe('with non-serializable class value transformation', () => {

        class DepartmentId {

          constructor(
            public readonly value: string,
          ) {
          }

        }

        class DepartmentIdModifier extends Modifier {

          public override onSerialize(value: DepartmentId): unknown {

            return value?.value;

          }

          public override onDeserialize(value: unknown): DepartmentId | undefined {

            return value
              ? new DepartmentId(value as string)
              : undefined;

          }

        }

        class Department extends SerializableObject {

          @property(StraightExtractor)
          @modifier(DepartmentIdModifier)
          public declare id: DepartmentId;

        }

        it('should transform property on serialize', () => {

          const instance = Department.create({
            id: new DepartmentId('123'),
          });

          const serialized = instance.serialize();
          expect(serialized.id)
            .toBe('123');

        });

        it('should transform property on deserialize', () => {

          const deserialized = Department.deserialize({
            id: '123',
          });
          expect(deserialized.id)
            .toBeInstanceOf(DepartmentId);
          expect(deserialized.id.value)
            .toBe('123');

        });

      });

    });

    describe('with extractor override-name', () => {

      class Department extends SerializableObject {

        @property(OverrideNameExtractor.use('department_id'))
        public declare id: string;

      }

      it('should serialize property to passed name', () => {

        const instance = Department.create({
          id: '123',
        });

        const serialized = instance.serialize();
        expect(serialized.department_id)
          .toBe('123');

      });

      it('should deserialize property from passed name', () => {

        const deserialized = Department.deserialize({
          department_id: '123',
        });
        expect(deserialized.id)
          .toBe('123');

      });

      describe('with value transformation', () => {

        class TestModifier extends Modifier {

          public override onSerialize(value: number): unknown {

            return value && String(value);

          }

          public override onDeserialize(value: unknown): number | undefined {

            return value
              ? Number(value)
              : undefined;

          }

        }

        class Department2 extends SerializableObject {

          @property(OverrideNameExtractor.use('department_id'))
          @modifier(TestModifier)
          public declare id: number;

        }

        it('should transform property on serialize', () => {

          const instance = Department2.create({
            id: 123,
          });

          const serialized = instance.serialize();
          expect(serialized.department_id)
            .toBe('123');

        });

        it('should transform property on deserialize', () => {

          const deserialized = Department2.deserialize({
            department_id: '123',
          });
          expect(deserialized.id)
            .toBe(123);

        });

      });

    });

  });

  describe('simple class', () => {

    describe('without extractor (default Straight Extractor)', () => {

      class Test {

        @property()
        public declare test: string;

      }

      it('should serialize property to same property key', () => {

        const instance = create(Test, {
          test: 'aaa',
        });

        const serialized = serialize(instance);
        expect(serialized.test)
          .toBe('aaa');

      });

      it('should deserialize property to same property key', () => {

        const deserialized = deserialize(Test, {
          test: 'aaa',
        });
        expect(deserialized.test)
          .toBe('aaa');

      });

    });

    describe('with Straight Extractor', () => {

      describe('with value transformation', () => {

        class TestModifier extends Modifier {

          public override onSerialize(value: number): unknown {

            return value && String(value);

          }

          public override onDeserialize(value: unknown): number | undefined {

            return value
              ? Number(value)
              : undefined;

          }

        }

        class Test {

          @property(StraightExtractor)
          @modifier(TestModifier)
          public declare test: number;

        }

        it('should transform property on serialize', () => {

          const instance = create(Test, {
            test: 123,
          });

          const serialized = serialize(instance);
          expect(serialized.test)
            .toBe('123');

        });

        it('should transform property on deserialize', () => {

          const deserialized = deserialize(Test, {
            test: '123',
          });
          expect(deserialized.test)
            .toBe(123);

        });

      });

    });

    describe('with extractor snakeCase', () => {

      class Test {

        @property(SnakeCaseExtractor)
        public declare testProperty: string;

      }

      it('should serialize property to snake_case transformed property key', () => {

        const instance = create(Test, {
          testProperty: 'aaa',
        });

        const serialized = serialize(instance);
        expect(serialized.test_property)
          .toBe('aaa');
        expect(serialized).not.toHaveProperty('testProperty');

      });

      it('should deserialize property to camelCase transformed property key', () => {

        const deserialized = deserialize(Test, {
          test_property: 'aaa',
        });
        expect(deserialized.testProperty)
          .toBe('aaa');
        expect(deserialized).not.toHaveProperty('test_property');

      });

      it('should throw error if property decorator assigned to non-string property key', () => {

        const symbolKey = Symbol('property');

        class Test2 {

          @property(SnakeCaseExtractor)
          public [symbolKey]?: string;

        }

        expect(() => {

          deserialize(Test2, {});

        })
          .toThrow(
            new NotStringPropertyKeyError(symbolKey),
          );

      });

      describe('with value transformation', () => {

        class TestModifier extends Modifier {

          public override onSerialize(value: number): unknown {

            return value && String(value);

          }

          public override onDeserialize(value: unknown): number | undefined {

            return value
              ? Number(value)
              : undefined;

          }

        }

        class Test2 {

          @property(SnakeCaseExtractor)
          @modifier(TestModifier)
          public declare testProperty: number;

        }

        it('should transform property on serialize', () => {

          const instance = create(Test2, {
            testProperty: 123,
          });

          const serialized = serialize(instance);
          expect(serialized.test_property)
            .toBe('123');

        });

        it('should transform property on deserialize', () => {

          const deserialized = deserialize(Test2, {
            test_property: '123',
          });
          expect(deserialized.testProperty)
            .toBe(123);

        });

      });

      describe('with non-serializable class value transformation', () => {

        class DepartmentId {

          constructor(
            public value: string,
          ) {
          }

        }

        class DepartmentIdModifier extends Modifier {

          public override onSerialize(value: DepartmentId): unknown {

            return value && value.value;

          }

          public override onDeserialize(value: unknown): DepartmentId | undefined {

            return value
              ? new DepartmentId(value as string)
              : undefined;

          }

        }

        class Department {

          @property(StraightExtractor)
          @modifier(DepartmentIdModifier)
          public declare id: DepartmentId;

        }

        it('should transform property on serialize', () => {

          const instance = create(Department, {
            id: new DepartmentId('123'),
          });

          const serialized = serialize(instance);
          expect(serialized.id)
            .toBe('123');

        });

        it('should transform property on deserialize', () => {

          const deserialized = deserialize(Department, {
            id: '123',
          });
          expect(deserialized.id)
            .toBeInstanceOf(DepartmentId);
          expect(deserialized.id.value)
            .toBe('123');

        });

      });

    });

    describe('with extractor override-name', () => {

      class Department {

        @property(OverrideNameExtractor.use('department_id'))
        public declare id: string;

      }

      it('should serialize property to passed name', () => {

        const instance = create(Department, {
          id: '123',
        });

        const serialized = serialize(instance);
        expect(serialized.department_id)
          .toBe('123');

      });

      it('should deserialize property from passed name', () => {

        const deserialized = deserialize(Department, {
          department_id: '123',
        });
        expect(deserialized.id)
          .toBe('123');

      });

      describe('with value transformation', () => {

        class DepartmentIdModifier extends Modifier {

          public override onSerialize(value: string): unknown {

            return value && String(value);

          }

          public override onDeserialize(value: unknown): number | undefined {

            return value
              ? Number(value)
              : undefined;

          }

        }

        class TestDepartment {

          @property(OverrideNameExtractor.use('department_id'))
          @modifier(DepartmentIdModifier)
          public declare id: number;

        }

        it('should transform property on serialize', () => {

          const instance = create(TestDepartment, {
            id: 123,
          });

          const serialized = serialize(instance);
          expect(serialized.department_id)
            .toBe('123');

        });

        it('should transform property on deserialize', () => {

          const deserialized = deserialize(TestDepartment, {
            department_id: '123',
          });
          expect(deserialized.id)
            .toBe(123);

        });

      });

    });

  });

  describe('should handle property as constructor argument', () => {

    class Test {

      constructor(
        @property(SnakeCaseExtractor)
        public someValue: string,
      ) {
      }

    }

    class TestParent {

      constructor(
        @property(SnakeCaseExtractor)
        @propertyType(Test)
        public testProperty: Test,
      ) {
      }

    }

    const deserialized = deserialize(TestParent, {
      test_property: {
        some_value: 'value',
      },
    });

    expect(deserialized)
      .toBeInstanceOf(TestParent);
    expect(deserialized.testProperty)
      .toBeInstanceOf(Test);
    expect(deserialized.testProperty.someValue)
      .toBe('value');

    const serialized = serialize(deserialized);
    expect(serialized)
      .toMatchObject({
        test_property: {
          some_value: 'value',
        },
      });

  });

});
