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

    it('should extend parent serializable properties even if class doesn\'t has own properties', () => {

      class Test {
        @property(SnakeCaseExtractor)
        public testProperty: string;
      }

      class SubTest extends Test { }

      class SubSubTest extends SubTest { }

      const deserialized = deserialize(SubSubTest, {
        test_property: 'value',
      });

      expect(deserialized.testProperty).toBe('value');
      expect(deserialized).toBeInstanceOf(SubSubTest);

      const serialized = serialize(deserialized);

      expect(serialized).toEqual({
        test_property: 'value',
      });

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

    it('should extend parent serializable properties even if class doesn\'t has own properties', () => {

      class Test extends SerializableObject {
        @property(SnakeCaseExtractor)
        public testProperty: string;
      }

      class SubTest extends Test { }

      class SubSubTest extends SubTest { }

      const deserialized = SubSubTest.deserialize({
        test_property: 'value',
      });

      expect(deserialized.testProperty).toBe('value');
      expect(deserialized).toBeInstanceOf(SubSubTest);

      const serialized = deserialized.serialize();

      expect(serialized).toEqual({
        test_property: 'value',
      });

    });

  });

});
