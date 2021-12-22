import { propertyType } from '../src/decorators/property-type/type';
import { property } from '../src/decorators/property/property';
import { create } from '../src/methods/create';
import { SerializableObject } from '../src/serializable-object';

describe('Instance create', () => {

  describe('simple class descendant of Serializable object', () => {

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

  describe('simple class', () => {

    class Test {
      @property()
      public testProperty: string = 'default value';

      @property()
      public undefinedByDefaultTestProperty: string;

      public nonSerializableProperty: string = 'default value of non-serializable property';

      public undefinedByDefaultNonSerializableProperty: string;
    }

    it('should create class instance', () => {
      const testInstance = create(Test);
      expect(testInstance).toBeInstanceOf(Test);
    });

    describe('should create class instance with serializable property', () => {

      it('value which was passed', () => {
        const testInstance = create(Test, {
          testProperty: 'value',
        });
        expect(testInstance.testProperty).toBe('value');
      });

      it('default value if value not passed', () => {
        const testInstance = create(Test);
        expect(testInstance.testProperty).toBe('default value');
      });

      it('null value if `null` value passed', () => {
        const testInstance = create(Test, {
          testProperty: null as any,
        });
        expect(testInstance.testProperty).toBe(null);
      });

      it('undefined value if `undefined` value passed', () => {
        const testInstance = create(Test, {
          testProperty: undefined,
        });
        expect(testInstance.testProperty).toBe(undefined);
      });

      it('undefined value if value not passed and property does not have default value', () => {
        const testInstance = create(Test, {
          undefinedByDefaultTestProperty: undefined,
        });
        expect(testInstance.undefinedByDefaultTestProperty).toBe(undefined);
      });

    });

    describe('should create class instance with non-serializable property', () => {

      it('value which was passed', () => {
        const testInstance = create(Test, {
          nonSerializableProperty: 'value',
        });
        expect(testInstance.nonSerializableProperty).toBe('value');
      });

      it('default value if value not passed', () => {
        const testInstance = create(Test);
        expect(testInstance.nonSerializableProperty).toBe('default value of non-serializable property');
      });

      it('null value if `null` value passed', () => {
        const testInstance = create(Test, {
          nonSerializableProperty: null as any,
        });
        expect(testInstance.nonSerializableProperty).toBe(null);
      });

      it('undefined value if `undefined` value passed', () => {
        const testInstance = create(Test, {
          nonSerializableProperty: undefined,
        });
        expect(testInstance.nonSerializableProperty).toBe(undefined);
      });

      it('undefined value if value not passed and property does not have default value', () => {
        const testInstance = create(Test, {
          undefinedByDefaultNonSerializableProperty: undefined,
        });
        expect(testInstance.undefinedByDefaultNonSerializableProperty).toBe(undefined);
      });

    });

  });

  describe('class with nested serializable properties descendant of Serializable object', () => {

    class DeepNestedProperty extends SerializableObject {
      @property()
      public test: number = 0;
    }

    class NestedProperty extends SerializableObject {
      @property()
      @propertyType(DeepNestedProperty)
      public deepNestedProperty: DeepNestedProperty;
    }

    class Test extends SerializableObject {
      @property()
      @propertyType(NestedProperty)
      public nestedProperty: NestedProperty;
    }

    it('should create instance with deep declaration', () => {
      const instance = Test.create({
        nestedProperty: {
          deepNestedProperty: {
            test: 78,
          },
        },
      });

      expect(instance.nestedProperty.deepNestedProperty.test).toBe(78);
      expect(instance.nestedProperty.deepNestedProperty).toBeInstanceOf(DeepNestedProperty);
      expect(instance.nestedProperty).toBeInstanceOf(NestedProperty);
    });

    it('should create instance without property if property value not passed', () => {
      const instance = Test.create({});
      expect(instance.nestedProperty).toBeUndefined();
    });

    it('should create instance with default property value if value not passed', () => {
      class Parent extends SerializableObject {
        @property()
        public test = Test.create();
      }

      const instance = Parent.create();
      expect(instance.test).toBeInstanceOf(Test);
    });

    it('should create different instances of nested serializable property every time', () => {
      class Parent extends SerializableObject {
        @property()
        public test = Test.create();
      }

      const instance1 = Parent.create();
      const instance2 = Parent.create();
      expect(instance1.test !== instance2.test);

    });

  });

  describe('class with nested serializable properties', () => {

    class DeepNestedProperty {
      @property()
      public test: number = 0;
    }

    class NestedProperty {
      @property()
      @propertyType(DeepNestedProperty)
      public deepNestedProperty: DeepNestedProperty;
    }

    class Test {
      @property()
      @propertyType(NestedProperty)
      public nestedProperty: NestedProperty;
    }

    it('should create instance with deep declaration', () => {
      const instance = create(Test, {
        nestedProperty: {
          deepNestedProperty: {
            test: 78,
          },
        },
      });

      expect(instance.nestedProperty.deepNestedProperty.test).toBe(78);
      expect(instance.nestedProperty.deepNestedProperty).toBeInstanceOf(DeepNestedProperty);
      expect(instance.nestedProperty).toBeInstanceOf(NestedProperty);
    });

    it('should create instance without property if property value not passed', () => {
      const instance = create(Test, {});
      expect(instance.nestedProperty).toBeUndefined();
    });

    it('should create instance with default property value if value not passed', () => {
      class Parent extends SerializableObject {
        @property()
        public test = create(Test);
      }

      const instance = Parent.create();
      expect(instance.test).toBeInstanceOf(Test);
    });

    it('should create different instances of nested serializable property every time', () => {
      class Parent extends SerializableObject {
        @property()
        public test = create(Test);
      }

      const instance1 = Parent.create();
      const instance2 = Parent.create();
      expect(instance1.test !== instance2.test);

    });

  });

  describe('class with nested serializable array property descendant of SerializableObject', () => {
    class ArrayItem extends SerializableObject {
      @property()
      public test: string;
    }
    class Test extends SerializableObject {
      @property()
      @propertyType(ArrayItem)
      public array: ArrayItem[];
    }

    it('should create instance with serializable array property', () => {
      const instance = Test.create({
        array: [
          {
            test: '123',
          },
          {
            test: '321',
          },
        ],
      });
      expect(instance.array.length).toBe(2);
      expect(instance.array[0]).toBeInstanceOf(ArrayItem);
      expect(instance.array[0].test).toBe('123');
    });

  });

  describe('class with nested serializable array property', () => {
    class ArrayItem {
      @property()
      public test: string;
    }
    class Test {
      @property()
      @propertyType(ArrayItem)
      public array: ArrayItem[];
    }

    it('should create instance with serializable array property', () => {
      const instance = create(Test, {
        array: [
          {
            test: '123',
          },
          {
            test: '321',
          },
        ],
      });
      expect(instance.array.length).toBe(2);
      expect(instance.array[0]).toBeInstanceOf(ArrayItem);
      expect(instance.array[0].test).toBe('123');
    });

  });

  describe('called with serializable class instance descendant of SerializableObject', () => {

    class Property extends SerializableObject {
      @property()
      public deepProperty: string;
    }

    class Test extends SerializableObject {
      @property()
      @propertyType(Property)
      public property: Property;
    }

    it('should return clone of instance', () => {

      const instance1 = Test.create({
        property: {
          deepProperty: 'test',
        },
      });

      const instance2 = Test.create(instance1);

      expect(instance2).toBeInstanceOf(Test);
      expect(instance2).not.toBe(instance1);
      expect(instance2.property.deepProperty).toBe('test');
      expect(instance2.property).toBeInstanceOf(Property);
      expect(instance2.property).not.toBe(instance1.property);

    });

  });

  describe('called with serializable class instance', () => {

    class Property {
      @property()
      public deepProperty: string;
    }

    class Test {
      @property()
      @propertyType(Property)
      public property: Property;
    }

    it('should return clone of instance', () => {

      const instance1 = create(Test, {
        property: {
          deepProperty: 'test',
        },
      });

      const instance2 = create(Test, instance1);

      expect(instance2).toBeInstanceOf(Test);
      expect(instance2).not.toBe(instance1);
      expect(instance2.property.deepProperty).toBe('test');
      expect(instance2.property).toBeInstanceOf(Property);
      expect(instance2.property).not.toBe(instance1.property);

    });

  });

});
