import { SnakeCaseExtractor } from '../src/common/extractors/snake-case-extractor';
import { modifier } from '../src/core/decorators/modifier';
import { property } from '../src/core/decorators/property';
import {
  ExtractionResult,
  Extractor,
} from '../src/core/types/extractor';
import { Modifier } from '../src/core/types/modifier';
import { SerializableObject } from '../src/serializable-object';
import { Constructor } from '../src/utils/constructor';

describe('Custom extractor', () => {

  describe('Nested data to plain', () => {

    class DeepExtractor extends Extractor {

      public static byPath(path: string): Constructor<DeepExtractor> {
        return class extends DeepExtractor {
          constructor(_: string, mod?: Modifier) {
            super(path, mod);
          }
        };
      }

      private static getObjectByPath(dataObject: unknown, keys: string[]): unknown {
        let extracted = dataObject;
        keys.forEach(key => {
          if (typeof extracted !== 'object' || extracted === null) {
            return undefined;
          }
          extracted = extracted[key as keyof typeof extracted];
        });
        return extracted;
      }

      private static getOrCreateObjectByPath(
        dataObject: Record<string, unknown>,
        keys: string[],
      ): Record<string, unknown> {
        let currentObject = dataObject;
        keys.forEach(key => {
          if (!Object.prototype.hasOwnProperty.call(currentObject, key)) {
            currentObject[key] = {};
          }
          currentObject = currentObject[key] as Record<string, unknown>;
        });
        return currentObject;
      }

      constructor(
        protected readonly key: string,
        mod?: Modifier,
      ) {
        super(key, mod);
      }

      public extract(data: unknown): ExtractionResult {
        if (typeof data !== 'object' || data === null) {
          return {
            data: undefined,
            path: this.key,
          };
        }
        return {
          data: this.modifier.onDeserialize(
            DeepExtractor.getObjectByPath(data, this.key.split('.')),
          ),
          path: this.key,
        };
      }

      public apply(applyObject: unknown, value: unknown): void {
        const keys = this.key.split('.');
        const dataObject = DeepExtractor.getOrCreateObjectByPath(
          applyObject as Record<string, unknown>,
          keys.slice(0, -1),
        );
        dataObject[keys[keys.length - 1]] = this.modifier.onSerialize(value);
      }

    }

    class StringAgeModifier extends Modifier {

      public override onDeserialize(value: unknown): number {
        return Number(value);
      }

      public override onSerialize(value: unknown): string {
        return String(value);
      }
    }

    class TestPerson extends SerializableObject {

      @property()
      public declare id: number;

      @property(DeepExtractor.byPath('data.person.age'))
      @modifier(StringAgeModifier)
      public declare age: number;

      @property(DeepExtractor.byPath('data.person.last_name'))
      public lastName: string = 'Default';

      @property(DeepExtractor.byPath('data.person.first_name'))
      public declare firstName: string;

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

      const person = TestPerson.createPartial({
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

    class OnlyDeserializeSnakeCaseExtractor extends SnakeCaseExtractor {
      public apply(): void {
      }
    }

    class Test extends SerializableObject {
      @property(OnlyDeserializeSnakeCaseExtractor)
      public declare id: number;
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
