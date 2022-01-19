import 'reflect-metadata';
import {
  property,
  SerializableObject,
} from '../src';
import { deserialize } from '../src/methods/deserialize';

describe('Property type auto-detection', () => {

  describe('descendant of SerializableObject', () => {

    class Property extends SerializableObject {
      @property()
      public data: any;
    }

    class Test extends SerializableObject {
      @property()
      public property: Property;
    }


    it('should auto detect type of on deserialize', () => {

      const instance = Test.deserialize({
        property: {},
      });

      expect(instance.property).toBeInstanceOf(Property);

    });

  });

  describe('simple class', () => {

    class Property {
      @property()
      public data: any;
    }

    class Test {
      @property()
      public property: Property;
    }


    it('should auto detect type of on deserialize', () => {

      const instance = deserialize(Test, {
        property: {},
      });

      expect(instance.property).toBeInstanceOf(Property);

    });

  });

});
