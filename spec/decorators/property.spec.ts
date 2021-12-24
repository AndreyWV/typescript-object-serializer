import { OverrideNameExtractor } from '../../src/decorators/property/override-name-extractor';
import { property } from '../../src/decorators/property/property';
import {
  NotStringPropertyKeyError,
  SnakeCaseExtractor,
} from '../../src/decorators/property/snake-case-extractor';
import { StraightExtractor } from '../../src/decorators/property/straight-extractor';
import { create } from '../../src/methods/create';
import { deserialize } from '../../src/methods/deserialize';
import { serialize } from '../../src/methods/serialize';
import { SerializableObject } from '../../src/serializable-object';

describe('Decorator @property', () => {

  describe('class descendant of SerializableObject', () => {

    describe('without extractor (default Straight Extractor)', () => {

      class Test extends SerializableObject {
        @property()
        public test: string;
      }

      it('should serialize property to same property key', () => {

        const instance = Test.create({
          test: 'aaa',
        });

        const serialized = instance.serialize();
        expect(serialized.test).toBe('aaa');

      });

      it('should deserialize property to same property key', () => {

        const deserialized = Test.deserialize({
          test: 'aaa',
        });
        expect(deserialized.test).toBe('aaa');

      });
    });

    describe('with Straight Extractor', () => {

      describe('with value transformation', () => {

        class Test extends SerializableObject {
          @property(StraightExtractor.transform({
            onDeserialize: (value: any) => value && Number(value),
            onSerialize: (value: number) => value && String(value)
          }))
          public test: number;
        }

        it('should transform property on serialize', () => {

          const instance = Test.create({
            test: 123,
          });

          const serialized = instance.serialize();
          expect(serialized.test).toBe('123');

        });

        it('should transform property on deserialize', () => {

          const deserialized = Test.deserialize({
            test: '123',
          });
          expect(deserialized.test).toBe(123);

        });
      });
    });

    describe('with extractor camelCase', () => {

      class Test extends SerializableObject {

        @property(SnakeCaseExtractor)
        public testProperty: string;

      }

      it('should serialize property to snake_case transformed property key', () => {

        const instance = Test.create({
          testProperty: 'aaa',
        });

        const serialized = instance.serialize();
        expect(serialized.test_property).toBe('aaa');
        expect(serialized).not.toHaveProperty('testProperty');

      });

      it('should deserialize property to camelCase transformed property key', () => {

        const deserialized = Test.deserialize({
          test_property: 'aaa',
        });
        expect(deserialized.testProperty).toBe('aaa');
        expect(deserialized).not.toHaveProperty('test_property');

      });

      it('should throw error if property decorator assigned to non-string property key', () => {

        const symbolKey = Symbol('property');

        expect(() => {
          class Test extends SerializableObject {
            @property(SnakeCaseExtractor)
            public [symbolKey]: string;
          }
        }).toThrowError(new NotStringPropertyKeyError(symbolKey));

      });

      describe('with value transformation', () => {

        class Test extends SerializableObject {
          @property(SnakeCaseExtractor.transform({
            onDeserialize: (value: any) => value && Number(value),
            onSerialize: (value: number) => value && String(value)
          }))
          public testProperty: number;
        }

        it('should transform property on serialize', () => {

          const instance = Test.create({
            testProperty: 123,
          });

          const serialized = instance.serialize();
          expect(serialized.test_property).toBe('123');

        });

        it('should transform property on deserialize', () => {

          const deserialized = Test.deserialize({
            test_property: '123',
          });
          expect(deserialized.testProperty).toBe(123);

        });
      });

      describe('with non-serializable class value transformation', () => {

        class DepartmentId {
          constructor(
            public value: string,
          ) {
          }
        }

        class Department extends SerializableObject {

          @property(StraightExtractor.transform({
            onDeserialize: value => new DepartmentId(value),
            onSerialize: (value: DepartmentId) => value.value,
          }))
          public id: DepartmentId;

        }

        it('should transform property on serialize', () => {

          const instance = Department.create({
            id: new DepartmentId('123'),
          });

          const serialized = instance.serialize();
          expect(serialized.id).toBe('123');

        });

        it('should transform property on deserialize', () => {

          const deserialized = Department.deserialize({
            id: '123',
          });
          expect(deserialized.id).toBeInstanceOf(DepartmentId);
          expect(deserialized.id.value).toBe('123');

        });
      });

    });

    describe('with extractor override-name', () => {

      class Department extends SerializableObject {

        @property(OverrideNameExtractor.use('department_id'))
        public id: string;

      }

      it('should serialize property to passed name', () => {

        const instance = Department.create({
          id: '123',
        });

        const serialized = instance.serialize();
        expect(serialized.department_id).toBe('123');

      });

      it('should deserialize property from passed name', () => {

        const deserialized = Department.deserialize({
          department_id: '123',
        });
        expect(deserialized.id).toBe('123');

      });

      describe('with value transformation', () => {

        class Department extends SerializableObject {
          @property(OverrideNameExtractor.use('department_id').transform({
            onDeserialize: (value: any) => value && Number(value),
            onSerialize: (value: number) => value && String(value)
          }))
          public id: number;
        }

        it('should transform property on serialize', () => {

          const instance = Department.create({
            id: 123,
          });

          const serialized = instance.serialize();
          expect(serialized.department_id).toBe('123');

        });

        it('should transform property on deserialize', () => {

          const deserialized = Department.deserialize({
            department_id: '123',
          });
          expect(deserialized.id).toBe(123);

        });
      });

    });

  });

  describe('simple class', () => {

    describe('without extractor (default Straight Extractor)', () => {

      class Test {
        @property()
        public test: string;
      }

      it('should serialize property to same property key', () => {

        const instance = create(Test, {
          test: 'aaa',
        });

        const serialized = serialize(instance);
        expect(serialized.test).toBe('aaa');

      });

      it('should deserialize property to same property key', () => {

        const deserialized = deserialize(Test, {
          test: 'aaa',
        });
        expect(deserialized.test).toBe('aaa');

      });
    });

    describe('with Straight Extractor', () => {

      describe('with value transformation', () => {

        class Test {
          @property(StraightExtractor.transform({
            onDeserialize: (value: any) => value && Number(value),
            onSerialize: (value: number) => value && String(value)
          }))
          public test: number;
        }

        it('should transform property on serialize', () => {

          const instance = create(Test, {
            test: 123,
          });

          const serialized = serialize(instance);
          expect(serialized.test).toBe('123');

        });

        it('should transform property on deserialize', () => {

          const deserialized = deserialize(Test, {
            test: '123',
          });
          expect(deserialized.test).toBe(123);

        });
      });
    });

    describe('with extractor camelCase', () => {

      class Test {

        @property(SnakeCaseExtractor)
        public testProperty: string;

      }

      it('should serialize property to snake_case transformed property key', () => {

        const instance = create(Test, {
          testProperty: 'aaa',
        });

        const serialized = serialize(instance);
        expect(serialized.test_property).toBe('aaa');
        expect(serialized).not.toHaveProperty('testProperty');

      });

      it('should deserialize property to camelCase transformed property key', () => {

        const deserialized = deserialize(Test, {
          test_property: 'aaa',
        });
        expect(deserialized.testProperty).toBe('aaa');
        expect(deserialized).not.toHaveProperty('test_property');

      });

      it('should throw error if property decorator assigned to non-string property key', () => {

        const symbolKey = Symbol('property');

        expect(() => {
          class Test {
            @property(SnakeCaseExtractor)
            public [symbolKey]: string;
          }
        }).toThrowError(new NotStringPropertyKeyError(symbolKey));

      });

      describe('with value transformation', () => {

        class Test {
          @property(SnakeCaseExtractor.transform({
            onDeserialize: (value: any) => value && Number(value),
            onSerialize: (value: number) => value && String(value)
          }))
          public testProperty: number;
        }

        it('should transform property on serialize', () => {

          const instance = create(Test, {
            testProperty: 123,
          });

          const serialized = serialize(instance);
          expect(serialized.test_property).toBe('123');

        });

        it('should transform property on deserialize', () => {

          const deserialized = deserialize(Test, {
            test_property: '123',
          });
          expect(deserialized.testProperty).toBe(123);

        });
      });

      describe('with non-serializable class value transformation', () => {

        class DepartmentId {
          constructor(
            public value: string,
          ) {
          }
        }

        class Department {

          @property(StraightExtractor.transform({
            onDeserialize: value => new DepartmentId(value),
            onSerialize: (value: DepartmentId) => value.value,
          }))
          public id: DepartmentId;

        }

        it('should transform property on serialize', () => {

          const instance = create(Department, {
            id: new DepartmentId('123'),
          });

          const serialized = serialize(instance);
          expect(serialized.id).toBe('123');

        });

        it('should transform property on deserialize', () => {

          const deserialized = deserialize(Department, {
            id: '123',
          });
          expect(deserialized.id).toBeInstanceOf(DepartmentId);
          expect(deserialized.id.value).toBe('123');

        });
      });

    });

    describe('with extractor override-name', () => {

      class Department {

        @property(OverrideNameExtractor.use('department_id'))
        public id: string;

      }

      it('should serialize property to passed name', () => {

        const instance = create(Department, {
          id: '123',
        });

        const serialized = serialize(instance);
        expect(serialized.department_id).toBe('123');

      });

      it('should deserialize property from passed name', () => {

        const deserialized = deserialize(Department, {
          department_id: '123',
        });
        expect(deserialized.id).toBe('123');

      });

      describe('with value transformation', () => {

        class Department {
          @property(OverrideNameExtractor.use('department_id').transform({
            onDeserialize: (value: any) => value && Number(value),
            onSerialize: (value: number) => value && String(value)
          }))
          public id: number;
        }

        it('should transform property on serialize', () => {

          const instance = create(Department, {
            id: 123,
          });

          const serialized = serialize(instance);
          expect(serialized.department_id).toBe('123');

        });

        it('should transform property on deserialize', () => {

          const deserialized = deserialize(Department, {
            department_id: '123',
          });
          expect(deserialized.id).toBe(123);

        });
      });

    });

  });

});
