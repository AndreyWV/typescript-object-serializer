import { property } from '../../src/core/decorators/property';
import { propertyType } from '../../src/core/decorators/property-type';
import { deserialize } from '../../src/core/methods/deserialize';
import { TypesClassStore } from '../../src/core/store/types-store';
import { SerializableObject } from '../../src/serializable-object';
import { Constructor } from '../../src/utils/constructor';

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

    it('should override default type in extended class if declared in parent class', () => {

      class BaseProperty extends SerializableObject {
        @property()
        public declare value: string;
      }

      class ExtendedProperty extends BaseProperty {
        @property()
        public declare extendedProperty: string;
      }

      class TestBase extends SerializableObject {
        @property()
        @propertyType(BaseProperty)
        public declare property: BaseProperty;
      }

      class TestExtended extends TestBase {
        @property()
        @propertyType(ExtendedProperty)
        public declare property: ExtendedProperty;
      }

      const propertiesStore = new TypesClassStore(TestExtended as unknown as Constructor<never>)
        .getStoreMapOrDeclareFromParent();

      let propertyTypeMap = propertiesStore.get('property');

      expect(propertyTypeMap?.size).toBe(1);

      const parentPropertiesStore = new TypesClassStore(TestBase as unknown as Constructor<never>)
        .getStoreMapOrDeclareFromParent();

      let parentPropertyTypeMap = parentPropertiesStore.get('property');

      expect(Array.from(parentPropertyTypeMap?.keys() ?? [])[0] as never)
        .toBe(BaseProperty);

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

    it('should override default type in extended class if declared in parent class', () => {

      class BaseProperty {
        @property()
        public declare value: string;
      }

      class ExtendedProperty extends BaseProperty {
        @property()
        public declare extendedProperty: string;
      }

      class TestBase {
        @property()
        @propertyType(BaseProperty)
        public declare property: BaseProperty;
      }

      class TestExtended extends TestBase {
        @property()
        @propertyType(ExtendedProperty)
        public declare property: ExtendedProperty;
      }

      const propertiesStore = new TypesClassStore(TestExtended as Constructor<never>)
        .getStoreMapOrDeclareFromParent();

      let propertyTypeMap = propertiesStore.get('property');

      expect(propertyTypeMap?.size).toBe(1);

      const parentPropertiesStore = new TypesClassStore(TestBase as Constructor<never>)
        .getStoreMapOrDeclareFromParent();

      let parentPropertyTypeMap = parentPropertiesStore.get('property');

      expect(Array.from(parentPropertyTypeMap?.keys() ?? [])[0] as never)
        .toBe(BaseProperty);

    });

  });

});
