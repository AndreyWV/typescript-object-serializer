import { deserialize } from '../../src/core/methods/deserialize';
import { property } from '../../src/core/decorators/property';
import { propertyType } from '../../src/core/decorators/property-type';
import { SerializableObject } from '../../src/serializable-object';

describe('Decorator @propertyType', () => {

  describe('in descendant of SerializableObject', () => {

    class TestProperty extends SerializableObject {
      @property()
      public declare value: string;
    }

    class SuccessResult extends SerializableObject {
      @property()
      public data?: unknown;
    }
    class FailedResult extends SerializableObject {
      @property()
      public error?: string;
    }

    class Test extends SerializableObject {

      @property()
      @propertyType(TestProperty)
      public property: unknown;

      @property()
      @propertyType(TestProperty)
      public declare arrayProperty: TestProperty[];

      @property()
      @propertyType(
        SuccessResult,
        (value: unknown) => Boolean(
          typeof value === 'object'
          && (value as Record<string, unknown>)?.success,
        ),
      )
      @propertyType(
        FailedResult,
        (value: unknown) => Boolean(
          typeof value === 'object'
          && !(value as Record<string, unknown>)?.success,
        ),
      )
      public declare conditionalPropertyType: SuccessResult | FailedResult;

      @property()
      @propertyType(
        SuccessResult,
        (value: unknown) => Boolean(
          typeof value === 'object'
          && (value as Record<string, unknown>)?.success,
        ),
      )
      @propertyType(
        FailedResult,
        (value: unknown) => Boolean(
          typeof value === 'object'
          && !(value as Record<string, unknown>)?.success,
        ),
      )
      public declare arrayWithConditionalPropertyType: Array<SuccessResult | FailedResult>;

    }

    describe('simple property', () => {

      it('should deserialize property to passed type', () => {
        const deserialized = Test.deserialize({
          property: {
            value: '123',
          },
        });
        expect(deserialized.property).toBeInstanceOf(TestProperty);
      });

    });

    describe('array property', () => {

      it('should deserialize array items to passed type', () => {
        const deserialized = Test.deserialize({
          arrayProperty: [
            {
              value: '123',
            },
            {
              value: '456',
            },
          ],
        });
        expect(deserialized.arrayProperty[0]).toBeInstanceOf(TestProperty);
        expect(deserialized.arrayProperty[1]).toBeInstanceOf(TestProperty);
      });

    });

    describe('conditional property', () => {

      it('should deserialize value to type depends on condition', () => {
        const deserializedSuccess = Test.deserialize({
          conditionalPropertyType: {
            success: true,
          },
        });
        const deserializedFailed = Test.deserialize({
          conditionalPropertyType: {
            success: false,
          },
        });

        expect(deserializedSuccess.conditionalPropertyType).toBeInstanceOf(SuccessResult);
        expect(deserializedFailed.conditionalPropertyType).toBeInstanceOf(FailedResult);
      });

    });

    describe('conditional array property', () => {

      it('should deserialize array values to type depends on condition', () => {
        const deserialized = Test.deserialize({
          arrayWithConditionalPropertyType: [
            {
              success: true,
            },
            {
              success: false,
            },
          ],
        });

        expect(deserialized.arrayWithConditionalPropertyType[0]).toBeInstanceOf(SuccessResult);
        expect(deserialized.arrayWithConditionalPropertyType[1]).toBeInstanceOf(FailedResult);
      });

    });

  });

  describe('in simple serializable class', () => {

    class TestProperty {
      @property()
      public declare value: string;
    }

    class SuccessResult {
      @property()
      public data?: unknown;
    }
    class FailedResult {
      @property()
      public error?: string;
    }

    class Test {

      @property()
      @propertyType(TestProperty)
      public property: unknown;

      @property()
      @propertyType(TestProperty)
      public declare arrayProperty: TestProperty[];

      @property()
      @propertyType(
        SuccessResult,
        (value: unknown) => Boolean(
          typeof value === 'object'
          && (value as Record<string, unknown>)?.success,
        ),
      )
      @propertyType(
        FailedResult,
        (value: unknown) => Boolean(
          typeof value === 'object'
          && !(value as Record<string, unknown>)?.success,
        ),
      )
      public declare conditionalPropertyType: SuccessResult | FailedResult;

      @property()
      @propertyType(
        SuccessResult,
        (value: unknown) => Boolean(
          typeof value === 'object'
          && (value as Record<string, unknown>)?.success,
        ),
      )
      @propertyType(
        FailedResult,
        (value: unknown) => Boolean(
          typeof value === 'object'
          && !(value as Record<string, unknown>)?.success,
        ),
      )
      public declare arrayWithConditionalPropertyType: Array<SuccessResult | FailedResult>;

    }

    describe('simple property', () => {

      it('should deserialize property to passed type', () => {
        const deserialized = deserialize(Test, {
          property: {
            value: '123',
          },
        });
        expect(deserialized.property).toBeInstanceOf(TestProperty);
      });

    });

    describe('array property', () => {

      it('should deserialize array items to passed type', () => {
        const deserialized = deserialize(Test, {
          arrayProperty: [
            {
              value: '123',
            },
            {
              value: '456',
            },
          ],
        });
        expect(deserialized.arrayProperty[0]).toBeInstanceOf(TestProperty);
        expect(deserialized.arrayProperty[1]).toBeInstanceOf(TestProperty);
      });

    });

    describe('conditional property', () => {

      it('should deserialize value to type depends on condition', () => {
        const deserializedSuccess = deserialize(Test, {
          conditionalPropertyType: {
            success: true,
          },
        });
        const deserializedFailed = deserialize(Test, {
          conditionalPropertyType: {
            success: false,
          },
        });

        expect(deserializedSuccess.conditionalPropertyType).toBeInstanceOf(SuccessResult);
        expect(deserializedFailed.conditionalPropertyType).toBeInstanceOf(FailedResult);
      });

    });

    describe('conditional array property', () => {

      it('should deserialize array values to type depends on condition', () => {
        const deserialized = deserialize(Test, {
          arrayWithConditionalPropertyType: [
            {
              success: true,
            },
            {
              success: false,
            },
          ],
        });

        expect(deserialized.arrayWithConditionalPropertyType[0]).toBeInstanceOf(SuccessResult);
        expect(deserialized.arrayWithConditionalPropertyType[1]).toBeInstanceOf(FailedResult);
      });

    });

  });

});
