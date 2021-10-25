import { property } from '../src/decorators/property/property';
import { SerializableObject } from '../src/serializable-object';

describe('Instance create', () => {

  describe('simple class', () => {

    class Test extends SerializableObject {
      @property()
      public testProperty: string = 'default value';

      @property()
      public undefinedByDefaultTestProperty: string;

      public nonSerializableProperty: string = 'default value of non-serializable property';

      public undefinedByDefaultNonSerializableProperty: string;
    }

    it('should create class instance', () => {
      const testInstance = Test.create();
      expect(testInstance).toBeInstanceOf(Test);
    });

    describe('should create class instance with serializable property', () => {

      it('value which was passed', () => {
        const testInstance = Test.create({
          testProperty: 'value',
        });
        expect(testInstance.testProperty).toBe('value');
      });

      it('default value if value not passed', () => {
        const testInstance = Test.create();
        expect(testInstance.testProperty).toBe('default value');
      });

      it('null value if `null` value passed', () => {
        const testInstance = Test.create({
          testProperty: null as any,
        });
        expect(testInstance.testProperty).toBe(null);
      });

      it('undefined value if `undefined` value passed', () => {
        const testInstance = Test.create({
          testProperty: undefined,
        });
        expect(testInstance.testProperty).toBe(undefined);
      });

      it('undefined value if value not passed and property does not have default value', () => {
        const testInstance = Test.create({
          undefinedByDefaultTestProperty: undefined,
        });
        expect(testInstance.undefinedByDefaultTestProperty).toBe(undefined);
      });

    });

    describe('should create class instance with non-serializable property', () => {

      it('value which was passed', () => {
        const testInstance = Test.create({
          nonSerializableProperty: 'value',
        });
        expect(testInstance.nonSerializableProperty).toBe('value');
      });

      it('default value if value not passed', () => {
        const testInstance = Test.create();
        expect(testInstance.nonSerializableProperty).toBe('default value of non-serializable property');
      });

      it('null value if `null` value passed', () => {
        const testInstance = Test.create({
          nonSerializableProperty: null as any,
        });
        expect(testInstance.nonSerializableProperty).toBe(null);
      });

      it('undefined value if `undefined` value passed', () => {
        const testInstance = Test.create({
          nonSerializableProperty: undefined,
        });
        expect(testInstance.nonSerializableProperty).toBe(undefined);
      });

      it('undefined value if value not passed and property does not have default value', () => {
        const testInstance = Test.create({
          undefinedByDefaultNonSerializableProperty: undefined,
        });
        expect(testInstance.undefinedByDefaultNonSerializableProperty).toBe(undefined);
      });

    });

  });

  describe('class with nested serializable properties', () => {

    class DeepNestedProperty extends SerializableObject {
      @property()
      public test: number = 0;
    }

    class NestedProperty extends SerializableObject {
      @property()
      public deepNestedProperty: DeepNestedProperty;
    }

    class Test extends SerializableObject {
      @property()
      public nestedProperty: NestedProperty;
    }

    describe('should create ', () => {

    });

  });

});
