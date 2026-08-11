import {
  property,
  SerializableObject,
} from '../src';
import { deserialize } from '../src/core/methods/deserialize';

import 'reflect-metadata';

describe('Property type auto-detection', () => {

  describe('descendant of SerializableObject', () => {

    class Property extends SerializableObject {

      @property()
      public data: unknown;

    }

    class Test extends SerializableObject {

      @property()
      public declare property: Property;

    }

    it('should auto detect type of on deserialize', () => {

      const instance = Test.deserialize({
        property: {},
      });

      expect(instance.property)
        .toBeInstanceOf(Property);

    });

  });

  describe('simple class', () => {

    class Property {

      @property()
      public data: unknown;

    }

    class Test {

      @property()
      public declare property: Property;

    }

    it('should auto detect type of on deserialize', () => {

      const instance = deserialize(Test, {
        property: {},
      });

      expect(instance.property)
        .toBeInstanceOf(Property);

    });

  });

  describe('autodetect basic types', () => {

    it('number', () => {

      class Test {

        @property()
        public declare numberItem: number;

      }

      const instance = deserialize(Test, {
        numberItem: 1,
      });

      expect(instance.numberItem)
        .toBe(1);

    });

    it('string', () => {

      class Test {

        @property()
        public declare stringItem: string;

      }

      const instance = deserialize(Test, {
        stringItem: 'test',
      });

      expect(instance.stringItem)
        .toBe('test');

    });

    it('boolean', () => {

      class Test {

        @property()
        public declare booleanItem: boolean;

      }

      const instance = deserialize(Test, {
        booleanItem: true,
      });

      expect(instance.booleanItem)
        .toBe(true);

    });

    it('null', () => {

      class Test {

        @property()
        public declare nullItem: null;

      }

      const instance = deserialize(Test, {
        nullItem: null,
      });

      expect(instance.nullItem)
        .toBe(null);

    });

    it('array of non-serializable items', () => {

      class Test {

        @property()
        public declare numberArray: number[];

        @property()
        public declare stringArray: string[];

        @property()
        public declare booleanArray: boolean[];

        @property()
        public declare nullArray: null[];

        @property()
        public declare objectsArray: object[];

        @property()
        public declare arraysArray: unknown[][];

      }

      const instance = deserialize(Test, {
        numberArray: [
          1,
          2,
          3,
        ],
        stringArray: [
          'a',
          'b',
          'c',
        ],
        booleanArray: [
          true,
          false,
        ],
        nullArray: [
          null,
          null,
          null,
        ],
        objectsArray: [
          {
            test: 1,
          },
          {
            test: 2,
          },
          {
            test: 3,
          },
        ],
        arraysArray: [
          [
            1,
            2,
            3,
          ],
          [
            'a',
            'b',
            'c',
          ],
          [
            true,
            false,
          ],
        ],
      });

      expect(instance.numberArray)
        .toEqual([
          1,
          2,
          3,
        ]);
      expect(instance.stringArray)
        .toEqual([
          'a',
          'b',
          'c',
        ]);
      expect(instance.booleanArray)
        .toEqual([
          true,
          false,
        ]);
      expect(instance.nullArray)
        .toEqual([
          null,
          null,
          null,
        ]);
      expect(instance.objectsArray)
        .toEqual([
          {
            test: 1,
          },
          {
            test: 2,
          },
          {
            test: 3,
          },
        ]);
      expect(instance.arraysArray)
        .toEqual([
          [
            1,
            2,
            3,
          ],
          [
            'a',
            'b',
            'c',
          ],
          [
            true,
            false,
          ],
        ]);

    });

  });

});
