import {
  deserialize,
  property,
  SerializableObject,
  serialize,
  SnakeCaseExtractor,
} from '../src';

describe('Common', () => {

  describe('simple class', () => {

    it('child should not affect parent class', () => {

      class Test {
        @property(SnakeCaseExtractor)
        public stringValue: string;
      }

      class TestChild extends Test {
        @property(SnakeCaseExtractor)
        public numberValue: number;
      }

      const testDeserialized = deserialize(TestChild, {
        string_value: 'string',
        number_value: 123,
      });

      expect(testDeserialized.numberValue).toBe(123);

      const parentInstance = deserialize(Test, {
        string_value: 'string',
        number_value: 123,
      });

      expect(parentInstance).not.toHaveProperty('numberValue');

      (parentInstance as any)['numberValue'] = 321;

      const serializedParent = serialize(parentInstance);
      expect(serializedParent).toEqual({
        string_value: 'string',
      });
      expect(serializedParent).not.toHaveProperty('number_value');

    });

  });

  describe('Descendant of SerializableObject', () => {

    it('child should not affect parent class', () => {

      class Test extends SerializableObject {
        @property(SnakeCaseExtractor)
        public stringValue: string;
      }

      class TestChild extends Test {
        @property(SnakeCaseExtractor)
        public numberValue: number;
      }

      const testDeserialized = TestChild.deserialize({
        string_value: 'string',
        number_value: 123,
      });

      expect(testDeserialized.numberValue).toBe(123);

      const parentInstance = Test.deserialize({
        string_value: 'string',
        number_value: 123,
      });

      expect(parentInstance).not.toHaveProperty('numberValue');

      (parentInstance as any)['numberValue'] = 321;

      const serializedParent = parentInstance.serialize();
      expect(serializedParent).toEqual({
        string_value: 'string',
      });
      expect(serializedParent).not.toHaveProperty('number_value');

    });

  });

});
