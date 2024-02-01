import { Extractor } from '../src/decorators/base-extractor';
import { property } from '../src/decorators/property';
import { SnakeCaseExtractor } from '../src/extractors/snake-case-extractor';
import { SerializableObject } from '../src/serializable-object';

describe('Custom extractor', () => {

  describe('Nested data to plain', () => {

    class DeepExtractor<T = any> extends Extractor<T> {

      public static byPath<C extends typeof DeepExtractor>(path: string): C {
        return class extends DeepExtractor {
          constructor() {
            super(path);
          }
        } as any;
      }

      private static getObjectByPath(dataObject: any, keys: string[]): any {
        let extracted: any = dataObject;
        keys.forEach(key => {
          if (!extracted) {
            return undefined;
          }
          extracted = (extracted as any)[key];
        });
        return extracted;
      }

      private static getOrCreateObjectByPath(dataObject: any, keys: string[]): any {
        let currentObject = dataObject;
        keys.forEach(key => {
          if (!currentObject.hasOwnProperty(key)) {
            currentObject[key] = {};
          }
          currentObject = currentObject[key];
        });
        return currentObject;
      }

      constructor(
        protected key: string,
      ) {
        super(key);
      }

      public extract(data: any): T | undefined {
        if (typeof data !== 'object' || data === null) {
          return undefined;
        }
        return this.transformBeforeExtract(
          DeepExtractor.getObjectByPath(data, this.key.split('.')),
        );
      }

      public apply(applyObject: any, value: T): void {
        const keys = this.key.split('.');
        const dataObject = DeepExtractor.getOrCreateObjectByPath(applyObject, keys.slice(0, -1));
        dataObject[keys[keys.length - 1]] = this.transformBeforeApply(value);
      }

    }

    class TestPerson extends SerializableObject {

      @property()
      public id: number;

      @property(DeepExtractor.byPath('data.person.age').transform({
        onDeserialize: value => value && Number(value),
        onSerialize: value => value && String(value),
      }))
      public age: number;

      @property(DeepExtractor.byPath('data.person.last_name'))
      public lastName: string = 'Default';

      @property(DeepExtractor.byPath('data.person.first_name'))
      public firstName: string;

    }

    it('should deserialize deep data', () => {

      const deserializedPerson = TestPerson.deserialize({
        id: 123,
        data: {
          person: {
            age: '20',
            last_name: 'Last',
            first_name: 'First',
          },
        },
      });

      expect(deserializedPerson.age).toBe(20);
      expect(deserializedPerson.firstName).toBe('First');
      expect(deserializedPerson.lastName).toBe('Last');

    });

    it('should serialize plain data to deep', () => {

      const person = TestPerson.create({
        age: 25,
        firstName: 'First',
        lastName: 'Last',
        id: 555,
      });

      expect(person.serialize()).toMatchObject({
        id: 555,
        data: {
          person: {
            last_name: 'Last',
            first_name: 'First',
            age: '25',
          },
        },
      });

    });

    it('should deserialize partial data', () => {

      const deserializedPerson = TestPerson.deserialize({
        id: 123,
        data: {
          person: {
            age: '20',
            first_name: 'First',
          },
        },
      });

      expect(deserializedPerson.age).toBe(20);
      expect(deserializedPerson.firstName).toBe('First');
      expect(deserializedPerson.lastName).toBe('Default');

    });

    it('should serialize partial data', () => {

      const person = TestPerson.create({
        age: 25,
        lastName: 'Last',
        id: 555,
      });

      expect(person.serialize()).toMatchObject({
        id: 555,
        data: {
          person: {
            last_name: 'Last',
            age: '25',
          },
        },
      });

    });

  });

  describe('Only deserialize property', () => {

    class OnlyDeserializeSnakeCaseExtractor<T> extends SnakeCaseExtractor<T> {
      public apply(applyObject: any, value: T): void {
      }
    }

    class Test extends SerializableObject {
      @property(OnlyDeserializeSnakeCaseExtractor)
      public id: number;
    }

    it('should deserialize data', () => {
      const deserialized = Test.deserialize({
        id: 123,
      });
      expect(deserialized.id).toBe(123);
    });

    it('should not serialize property data', () => {
      const instance = Test.create({
        id: 123,
      });
      expect(instance.serialize()).toMatchObject({});
    });

  });

});
