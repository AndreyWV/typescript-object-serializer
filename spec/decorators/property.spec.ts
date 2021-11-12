import { ExtractorCamelCase } from '../../src/decorators/property/extractor-camel-case';
import { property } from '../../src/decorators/property/property';
import { SerializableObject } from '../../src/serializable-object';

describe('Decorator @property', () => {

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

  describe('with extractor camelCase', () => {

    class Test extends SerializableObject {

      @property(ExtractorCamelCase)
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

  });

});
