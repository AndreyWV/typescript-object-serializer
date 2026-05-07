import { property } from '../src/core/decorators/property';
import { propertyType } from '../src/core/decorators/property-type';
import {
  create,
  createPartial,
} from '../src/core/methods/create';
import { SerializableObject } from '../src/serializable-object';

describe('Instance create', () => {

  describe('[Partial]', () => {

    describe('class descendant of Serializable object', () => {

      class Test extends SerializableObject {

        @property()
        public testProperty: string = 'default value';

        @property()
        public declare undefinedByDefaultTestProperty: string;

        public nonSerializableProperty: string = 'default value of non-serializable property';

        public declare undefinedByDefaultNonSerializableProperty: string;

      }

      it('should create class instance', () => {

        const testInstance = Test.createPartial();
        expect(testInstance)
          .toBeInstanceOf(Test);

      });

      it('should create class instance extending parent', () => {

        class TestExtended extends Test {

          @property()
          public declare extendedProperty: string;

        }
        const testInstance = TestExtended.createPartial();
        expect(testInstance)
          .toBeInstanceOf(Test);
        expect(testInstance)
          .toBeInstanceOf(TestExtended);

      });

      describe('should create class instance with serializable property', () => {

        it('value which was passed', () => {

          const testInstance = Test.createPartial({
            testProperty: 'value',
          });
          expect(testInstance.testProperty)
            .toBe('value');

        });

        it('default value if value not passed', () => {

          const testInstance = Test.createPartial();
          expect(testInstance.testProperty)
            .toBe('default value');

        });

        it('null value if `null` value passed', () => {

          const testInstance = Test.createPartial({
            testProperty: null as any,
          });
          expect(testInstance.testProperty)
            .toBe(null);

        });

        it('undefined value if `undefined` value passed', () => {

          const testInstance = Test.createPartial({
            testProperty: undefined,
          });
          expect(testInstance.testProperty)
            .toBe(undefined);

        });

        it('undefined value if value not passed and property does not have default value', () => {

          const testInstance = Test.createPartial({
            undefinedByDefaultTestProperty: undefined,
          });
          expect(testInstance.undefinedByDefaultTestProperty)
            .toBe(undefined);

        });

      });

      describe('should create class instance with non-serializable property', () => {

        it('value which was passed', () => {

          const testInstance = Test.createPartial({
            nonSerializableProperty: 'value',
          });
          expect(testInstance.nonSerializableProperty)
            .toBe('value');

        });

        it('default value if value not passed', () => {

          const testInstance = Test.createPartial();
          expect(testInstance.nonSerializableProperty)
            .toBe('default value of non-serializable property');

        });

        it('null value if `null` value passed', () => {

          const testInstance = Test.createPartial({
            nonSerializableProperty: null as any,
          });
          expect(testInstance.nonSerializableProperty)
            .toBe(null);

        });

        it('undefined value if `undefined` value passed', () => {

          const testInstance = Test.createPartial({
            nonSerializableProperty: undefined,
          });
          expect(testInstance.nonSerializableProperty)
            .toBe(undefined);

        });

        it('undefined value if value not passed and property does not have default value', () => {

          const testInstance = Test.createPartial({
            undefinedByDefaultNonSerializableProperty: undefined,
          });
          expect(testInstance.undefinedByDefaultNonSerializableProperty)
            .toBe(undefined);

        });

      });

      describe('should create class instance with empty value of serializable property', () => {

        class Employee extends SerializableObject {

          @property()
          public declare name: string;

        }

        class Department extends SerializableObject {

          @property()
          @propertyType(Employee)
          public declare employees: Employee[];

        }

        it('null value', () => {

          const department = Department.createPartial({
            employees: null as any,
          });
          expect(department.employees)
            .toBe(null);

        });

        it('undefined value', () => {

          const department = Department.createPartial({
            employees: undefined,
          });
          expect(department.employees)
            .toBe(undefined);

        });

      });

    });

    describe('simple class', () => {

      class Test {

        @property()
        public testProperty: string = 'default value';

        @property()
        public declare undefinedByDefaultTestProperty: string;

        public nonSerializableProperty: string = 'default value of non-serializable property';

        public declare undefinedByDefaultNonSerializableProperty: string;

      }

      it('should create class instance', () => {

        const testInstance = createPartial(Test);
        expect(testInstance)
          .toBeInstanceOf(Test);

      });

      it('should create class instance extending parent', () => {

        class TestExtended extends Test {

          @property()
          public declare extendedProperty: string;

        }
        const testInstance = createPartial(TestExtended);
        expect(testInstance)
          .toBeInstanceOf(Test);
        expect(testInstance)
          .toBeInstanceOf(TestExtended);

      });

      describe('should create class instance with serializable property', () => {

        it('value which was passed', () => {

          const testInstance = createPartial(Test, {
            testProperty: 'value',
          });
          expect(testInstance.testProperty)
            .toBe('value');

        });

        it('default value if value not passed', () => {

          const testInstance = createPartial(Test);
          expect(testInstance.testProperty)
            .toBe('default value');

        });

        it('null value if `null` value passed', () => {

          const testInstance = createPartial(Test, {
            testProperty: null as any,
          });
          expect(testInstance.testProperty)
            .toBe(null);

        });

        it('undefined value if `undefined` value passed', () => {

          const testInstance = createPartial(Test, {
            testProperty: undefined,
          });
          expect(testInstance.testProperty)
            .toBe(undefined);

        });

        it('undefined value if value not passed and property does not have default value', () => {

          const testInstance = createPartial(Test, {
            undefinedByDefaultTestProperty: undefined,
          });
          expect(testInstance.undefinedByDefaultTestProperty)
            .toBe(undefined);

        });

      });

      describe('should create class instance with non-serializable property', () => {

        it('value which was passed', () => {

          const testInstance = createPartial(Test, {
            nonSerializableProperty: 'value',
          });
          expect(testInstance.nonSerializableProperty)
            .toBe('value');

        });

        it('default value if value not passed', () => {

          const testInstance = createPartial(Test);
          expect(testInstance.nonSerializableProperty)
            .toBe('default value of non-serializable property');

        });

        it('null value if `null` value passed', () => {

          const testInstance = createPartial(Test, {
            nonSerializableProperty: null as any,
          });
          expect(testInstance.nonSerializableProperty)
            .toBe(null);

        });

        it('undefined value if `undefined` value passed', () => {

          const testInstance = createPartial(Test, {
            nonSerializableProperty: undefined,
          });
          expect(testInstance.nonSerializableProperty)
            .toBe(undefined);

        });

        it('undefined value if value not passed and property does not have default value', () => {

          const testInstance = createPartial(Test, {
            undefinedByDefaultNonSerializableProperty: undefined,
          });
          expect(testInstance.undefinedByDefaultNonSerializableProperty)
            .toBe(undefined);

        });

      });

      describe('should create class instance with empty value of serializable property', () => {

        class Employee {

          @property()
          public declare name: string;

        }

        class Department {

          @property()
          @propertyType(Employee)
          public declare employees: Employee[];

        }

        it('null value', () => {

          const department = createPartial(Department, {
            employees: null as any,
          });
          expect(department.employees)
            .toBe(null);

        });

        it('undefined value', () => {

          const department = createPartial(Department, {
            employees: undefined,
          });
          expect(department.employees)
            .toBe(undefined);

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
        public declare deepNestedProperty: DeepNestedProperty;

      }

      class Test extends SerializableObject {

        @property()
        @propertyType(NestedProperty)
        public declare nestedProperty: NestedProperty;

      }

      it('should create instance with deep declaration', () => {

        const instance = Test.createPartial({
          nestedProperty: {
            deepNestedProperty: {
              test: 78,
            },
          },
        });

        expect(instance.nestedProperty.deepNestedProperty.test)
          .toBe(78);
        expect(instance.nestedProperty.deepNestedProperty)
          .toBeInstanceOf(DeepNestedProperty);
        expect(instance.nestedProperty)
          .toBeInstanceOf(NestedProperty);

      });

      it('should create instance without property if property value not passed', () => {

        const instance = Test.createPartial({});
        expect(instance.nestedProperty)
          .toBeUndefined();

      });

      it('should create instance with default property value if value not passed', () => {

        class Parent extends SerializableObject {

          @property()
          public test = Test.createPartial();

        }

        const instance = Parent.createPartial();
        expect(instance.test)
          .toBeInstanceOf(Test);

      });

      it('should create different instances of nested serializable property every time', () => {

        class Parent extends SerializableObject {

          @property()
          public test = Test.createPartial();

        }

        const instance1 = Parent.createPartial();
        const instance2 = Parent.createPartial();
        expect(instance1.test).not.toBe(instance2.test);

      });

      it('should create extended instance of nested serializable class', () => {

        class DeepNestedPropertyExtended extends DeepNestedProperty {

          @property()
          public test: number = 0;

          @property()
          public declare extendedProperty: string;

        }

        const instance = Test.createPartial({
          nestedProperty: {
            deepNestedProperty: DeepNestedPropertyExtended.createPartial({
              test: 78,
              extendedProperty: 'extended',
            }),
          },
        });

        expect(instance.nestedProperty.deepNestedProperty.test)
          .toBe(78);
        expect(instance.nestedProperty.deepNestedProperty)
          .toBeInstanceOf(DeepNestedPropertyExtended);
        expect(instance.nestedProperty)
          .toBeInstanceOf(NestedProperty);

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
        public declare deepNestedProperty: DeepNestedProperty;

      }

      class Test {

        @property()
        @propertyType(NestedProperty)
        public declare nestedProperty: NestedProperty;

      }

      it('should create instance with deep declaration', () => {

        const instance = create(Test, {
          nestedProperty: {
            deepNestedProperty: {
              test: 78,
            },
          },
        });

        expect(instance.nestedProperty.deepNestedProperty.test)
          .toBe(78);
        expect(instance.nestedProperty.deepNestedProperty)
          .toBeInstanceOf(DeepNestedProperty);
        expect(instance.nestedProperty)
          .toBeInstanceOf(NestedProperty);

      });

      it('should create instance without property if property value not passed', () => {

        const instance = createPartial(Test, {});
        expect(instance.nestedProperty)
          .toBeUndefined();

      });

      it('should create instance with default property value if value not passed', () => {

        class Parent extends SerializableObject {

          @property()
          public test = createPartial(Test);

        }

        const instance = Parent.createPartial();
        expect(instance.test)
          .toBeInstanceOf(Test);

      });

      it('should create different instances of nested serializable property every time', () => {

        class Parent extends SerializableObject {

          @property()
          public test = createPartial(Test);

        }

        const instance1 = Parent.createPartial();
        const instance2 = Parent.createPartial();
        expect(instance1.test).not.toBe(instance2.test);

      });

      it('should create extended instance of nested serializable class', () => {

        class DeepNestedPropertyExtended extends DeepNestedProperty {

          @property()
          public test: number = 0;

          @property()
          public declare extendedProperty: string;

        }

        const instance = createPartial(Test, {
          nestedProperty: {
            deepNestedProperty: createPartial(DeepNestedPropertyExtended, {
              test: 78,
              extendedProperty: 'extended',
            }),
          },
        });

        expect(instance.nestedProperty.deepNestedProperty.test)
          .toBe(78);
        expect(instance.nestedProperty.deepNestedProperty)
          .toBeInstanceOf(DeepNestedPropertyExtended);
        expect(instance.nestedProperty)
          .toBeInstanceOf(NestedProperty);

      });

    });

    describe('class with nested serializable array property descendant of SerializableObject', () => {

      class ArrayItem extends SerializableObject {

        @property()
        public declare test: string;

      }
      class Test extends SerializableObject {

        @property()
        @propertyType(ArrayItem)
        public declare array: ArrayItem[];

      }

      it('should create instance with serializable array property', () => {

        const instance = Test.createPartial({
          array: [
            {
              test: '123',
            },
            {
              test: '321',
            },
          ],
        });
        expect(instance.array.length)
          .toBe(2);
        expect(instance.array[0])
          .toBeInstanceOf(ArrayItem);
        expect(instance.array[0].test)
          .toBe('123');

      });

      it('should create instance with serializable array property extended item class', () => {

        class ArrayItemExtended extends ArrayItem {

          @property()
          public declare extendedProperty: string;

        }

        const instance = Test.createPartial({
          array: [
            {
              test: '123',
            },
            ArrayItemExtended.createPartial({
              test: '321',
              extendedProperty: 'extended',
            }),
          ],
        });
        expect(instance.array.length)
          .toBe(2);
        expect(instance.array[0])
          .toBeInstanceOf(ArrayItem);
        expect(instance.array[0].test)
          .toBe('123');
        expect(instance.array[1])
          .toBeInstanceOf(ArrayItem);
        expect(instance.array[1])
          .toBeInstanceOf(ArrayItemExtended);
        expect(instance.array[1].test)
          .toBe('321');
        expect((instance.array[1] as ArrayItemExtended).extendedProperty)
          .toBe('extended');

      });

    });

    describe('class with nested serializable array property', () => {

      class ArrayItem {

        @property()
        public declare test: string;

      }
      class Test {

        @property()
        @propertyType(ArrayItem)
        public declare array: ArrayItem[];

      }

      it('should create instance with serializable array property', () => {

        const instance = createPartial(Test, {
          array: [
            {
              test: '123',
            },
            {
              test: '321',
            },
          ],
        });
        expect(instance.array.length)
          .toBe(2);
        expect(instance.array[0])
          .toBeInstanceOf(ArrayItem);
        expect(instance.array[0].test)
          .toBe('123');

      });

      it('should create instance with serializable array property extended item class', () => {

        class ArrayItemExtended extends ArrayItem {

          @property()
          public declare extendedProperty: string;

        }

        const instance = createPartial(Test, {
          array: [
            {
              test: '123',
            },
            createPartial(ArrayItemExtended, {
              test: '321',
              extendedProperty: 'extended',
            }),
          ],
        });
        expect(instance.array.length)
          .toBe(2);
        expect(instance.array[0])
          .toBeInstanceOf(ArrayItem);
        expect(instance.array[0].test)
          .toBe('123');
        expect(instance.array[1])
          .toBeInstanceOf(ArrayItem);
        expect(instance.array[1])
          .toBeInstanceOf(ArrayItemExtended);
        expect(instance.array[1].test)
          .toBe('321');
        expect((instance.array[1] as ArrayItemExtended).extendedProperty)
          .toBe('extended');

      });

    });

    describe('called with serializable class instance descendant of SerializableObject', () => {

      class Property extends SerializableObject {

        @property()
        public declare deepProperty: string;

      }

      class Test extends SerializableObject {

        @property()
        @propertyType(Property)
        public declare property: Property;

      }

      it('should return clone of instance', () => {

        const instance1 = Test.createPartial({
          property: {
            deepProperty: 'test',
          },
        });

        const instance2 = Test.createPartial(instance1);

        expect(instance2)
          .toBeInstanceOf(Test);
        expect(instance2).not.toBe(instance1);
        expect(instance2.property.deepProperty)
          .toBe('test');
        expect(instance2.property)
          .toBeInstanceOf(Property);
        expect(instance2.property).not.toBe(instance1.property);

      });

    });

    describe('called with serializable class instance', () => {

      class Property {

        @property()
        public declare deepProperty: string;

      }

      class Test {

        @property()
        @propertyType(Property)
        public declare property: Property;

      }

      it('should return clone of instance', () => {

        const instance1 = createPartial(Test, {
          property: {
            deepProperty: 'test',
          },
        });

        const instance2 = createPartial(Test, instance1);

        expect(instance2)
          .toBeInstanceOf(Test);
        expect(instance2).not.toBe(instance1);
        expect(instance2.property.deepProperty)
          .toBe('test');
        expect(instance2.property)
          .toBeInstanceOf(Property);
        expect(instance2.property).not.toBe(instance1.property);

      });

    });

  });

  describe('[Strict]', () => {

    describe('class descendant of Serializable object', () => {

      class Test extends SerializableObject {

        @property()
        public testProperty: string | null | undefined = 'default value';

        @property()
        public undefinedByDefaultTestProperty?: string;

        public nonSerializableProperty?: string | null = 'default value of non-serializable property';

        public undefinedByDefaultNonSerializableProperty?: string;

      }

      it('should create class instance', () => {

        const testInstance = Test.create({} as never);
        expect(testInstance)
          .toBeInstanceOf(Test);

      });

      it('should create class instance extending parent', () => {

        class TestExtended extends Test {

          @property()
          public declare extendedProperty: string;

        }
        const testInstance = TestExtended.create({} as never);
        expect(testInstance)
          .toBeInstanceOf(Test);
        expect(testInstance)
          .toBeInstanceOf(TestExtended);

      });

      describe('should create class instance with serializable property', () => {

        it('value which was passed', () => {

          const testInstance = Test.create({
            testProperty: 'value',
          });
          expect(testInstance.testProperty)
            .toBe('value');

        });

        it('null value if `null` value passed', () => {

          const testInstance = Test.create({
            testProperty: null,
          });
          expect(testInstance.testProperty)
            .toBe(null);

        });

        it('undefined value if `undefined` value passed', () => {

          const testInstance = Test.create({
            testProperty: undefined,
          });
          expect(testInstance.testProperty)
            .toBe(undefined);

        });

        it('undefined value if value not passed and property does not have default value', () => {

          const testInstance = Test.create({
            testProperty: undefined,
            undefinedByDefaultTestProperty: undefined,
          });
          expect(testInstance.undefinedByDefaultTestProperty)
            .toBe(undefined);

        });

      });

      describe('should create class instance with non-serializable property', () => {

        it('value which was passed', () => {

          const testInstance = Test.create({
            testProperty: undefined,
            nonSerializableProperty: 'value',
          });
          expect(testInstance.nonSerializableProperty)
            .toBe('value');

        });

        it('default value if value not passed', () => {

          const testInstance = Test.create({} as never);
          expect(testInstance.nonSerializableProperty)
            .toBe('default value of non-serializable property');

        });

        it('null value if `null` value passed', () => {

          const testInstance = Test.create({
            testProperty: undefined,
            nonSerializableProperty: null,
          });
          expect(testInstance.nonSerializableProperty)
            .toBe(null);

        });

        it('undefined value if `undefined` value passed', () => {

          const testInstance = Test.create({
            testProperty: undefined,
            nonSerializableProperty: undefined,
          });
          expect(testInstance.nonSerializableProperty)
            .toBe(undefined);

        });

        it('undefined value if value not passed and property does not have default value', () => {

          const testInstance = Test.create({
            testProperty: undefined,
            undefinedByDefaultNonSerializableProperty: undefined,
          });
          expect(testInstance.undefinedByDefaultNonSerializableProperty)
            .toBe(undefined);

        });

      });

      describe('should create class instance with empty value of serializable property', () => {

        class Employee extends SerializableObject {

          @property()
          public declare name: string;

        }

        class Department extends SerializableObject {

          @property()
          @propertyType(Employee)
          public declare employees: Employee[] | null | undefined;

        }

        it('null value', () => {

          const department = Department.create({
            employees: null,
          });
          expect(department.employees)
            .toBe(null);

        });

        it('undefined value', () => {

          const department = Department.create({
            employees: undefined,
          });
          expect(department.employees)
            .toBe(undefined);

        });

      });

    });

    describe('simple class', () => {

      class Test {

        @property()
        public testProperty: string | null | undefined = 'default value';

        @property()
        public undefinedByDefaultTestProperty?: string | null;

        public nonSerializableProperty?: string | null = 'default value of non-serializable property';

        public undefinedByDefaultNonSerializableProperty?: string | null;

      }

      it('should create class instance', () => {

        const testInstance = create(Test, {} as never);
        expect(testInstance)
          .toBeInstanceOf(Test);

      });

      it('should create class instance extending parent', () => {

        class TestExtended extends Test {

          @property()
          public declare extendedProperty: string;

        }
        const testInstance = create(TestExtended, {} as never);
        expect(testInstance)
          .toBeInstanceOf(Test);
        expect(testInstance)
          .toBeInstanceOf(TestExtended);

      });

      describe('should create class instance with serializable property', () => {

        it('value which was passed', () => {

          const testInstance = create(Test, {
            testProperty: 'value',
          });
          expect(testInstance.testProperty)
            .toBe('value');

        });

        it('default value if value not passed', () => {

          const testInstance = create(Test, {} as never);
          expect(testInstance.testProperty)
            .toBe('default value');

        });

        it('null value if `null` value passed', () => {

          const testInstance = create(Test, {
            testProperty: null,
          });
          expect(testInstance.testProperty)
            .toBe(null);

        });

        it('undefined value if `undefined` value passed', () => {

          const testInstance = create(Test, {
            testProperty: undefined,
          });
          expect(testInstance.testProperty)
            .toBe(undefined);

        });

        it('undefined value if value not passed and property does not have default value', () => {

          const testInstance = create(Test, {
            testProperty: undefined,
            undefinedByDefaultTestProperty: undefined,
          });
          expect(testInstance.undefinedByDefaultTestProperty)
            .toBe(undefined);

        });

      });

      describe('should create class instance with non-serializable property', () => {

        it('value which was passed', () => {

          const testInstance = create(Test, {
            testProperty: undefined,
            nonSerializableProperty: 'value',
          });
          expect(testInstance.nonSerializableProperty)
            .toBe('value');

        });

        it('default value if value not passed', () => {

          const testInstance = create(Test, {
            testProperty: undefined,
          });
          expect(testInstance.nonSerializableProperty)
            .toBe('default value of non-serializable property');

        });

        it('null value if `null` value passed', () => {

          const testInstance = create(Test, {
            testProperty: undefined,
            nonSerializableProperty: null,
          });
          expect(testInstance.nonSerializableProperty)
            .toBe(null);

        });

        it('undefined value if `undefined` value passed', () => {

          const testInstance = create(Test, {
            testProperty: undefined,
            nonSerializableProperty: undefined,
          });
          expect(testInstance.nonSerializableProperty)
            .toBe(undefined);

        });

        it('undefined value if value not passed and property does not have default value', () => {

          const testInstance = create(Test, {
            testProperty: undefined,
            undefinedByDefaultNonSerializableProperty: undefined,
          });
          expect(testInstance.undefinedByDefaultNonSerializableProperty)
            .toBe(undefined);

        });

      });

      describe('should create class instance with empty value of serializable property', () => {

        class Employee {

          @property()
          public declare name: string;

        }

        class Department {

          @property()
          @propertyType(Employee)
          public declare employees: Employee[] | null | undefined;

        }

        it('null value', () => {

          const department = create(Department, {
            employees: null,
          });
          expect(department.employees)
            .toBe(null);

        });

        it('undefined value', () => {

          const department = create(Department, {
            employees: undefined,
          });
          expect(department.employees)
            .toBe(undefined);

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
        public declare deepNestedProperty?: DeepNestedProperty;

      }

      class Test extends SerializableObject {

        @property()
        @propertyType(NestedProperty)
        public declare nestedProperty?: NestedProperty;

      }

      it('should create instance with deep declaration', () => {

        const instance = Test.create({
          nestedProperty: {
            deepNestedProperty: {
              test: 78,
            },
          },
        });

        expect(instance.nestedProperty?.deepNestedProperty?.test)
          .toBe(78);
        expect(instance.nestedProperty?.deepNestedProperty)
          .toBeInstanceOf(DeepNestedProperty);
        expect(instance.nestedProperty)
          .toBeInstanceOf(NestedProperty);

      });

      it('should create instance without property if property value not passed', () => {

        const instance = Test.create({});
        expect(instance.nestedProperty)
          .toBeUndefined();

      });

      it('should create instance with default property value if value not passed', () => {

        class Parent extends SerializableObject {

          @property()
          public test? = Test.create({});

        }

        const instance = Parent.create({});
        expect(instance.test)
          .toBeInstanceOf(Test);

      });

      it('should create different instances of nested serializable property every time', () => {

        class Parent extends SerializableObject {

          @property()
          public test? = Test.create({});

        }

        const instance1 = Parent.create({});
        const instance2 = Parent.create({});
        expect(instance1.test).not.toBe(instance2.test);

      });

      it('should create extended instance of nested serializable class', () => {

        class DeepNestedPropertyExtended extends DeepNestedProperty {

          @property()
          public test: number = 0;

          @property()
          public declare extendedProperty: string;

        }

        const instance = Test.create({
          nestedProperty: {
            deepNestedProperty: DeepNestedPropertyExtended.create({
              test: 78,
              extendedProperty: 'extended',
            }),
          },
        });

        expect(instance.nestedProperty?.deepNestedProperty?.test)
          .toBe(78);
        expect(instance.nestedProperty?.deepNestedProperty)
          .toBeInstanceOf(DeepNestedPropertyExtended);
        expect(instance.nestedProperty)
          .toBeInstanceOf(NestedProperty);

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
        public declare deepNestedProperty?: DeepNestedProperty;

      }

      class Test {

        @property()
        @propertyType(NestedProperty)
        public declare nestedProperty?: NestedProperty;

      }

      it('should create instance with deep declaration', () => {

        const instance = create(Test, {
          nestedProperty: {
            deepNestedProperty: {
              test: 78,
            },
          },
        });

        expect(instance.nestedProperty?.deepNestedProperty?.test)
          .toBe(78);
        expect(instance.nestedProperty?.deepNestedProperty)
          .toBeInstanceOf(DeepNestedProperty);
        expect(instance.nestedProperty)
          .toBeInstanceOf(NestedProperty);

      });

      it('should create instance without property if property value not passed', () => {

        const instance = create(Test, {});
        expect(instance.nestedProperty)
          .toBeUndefined();

      });

      it('should create instance with default property value if value not passed', () => {

        class Parent extends SerializableObject {

          @property()
          public test? = createPartial(Test);

        }

        const instance = Parent.create({});
        expect(instance.test)
          .toBeInstanceOf(Test);

      });

      it('should create different instances of nested serializable property every time', () => {

        class Parent extends SerializableObject {

          @property()
          public test? = create(Test, {});

        }

        const instance1 = Parent.create({});
        const instance2 = Parent.create({});
        expect(instance1.test).not.toBe(instance2.test);

      });

      it('should create extended instance of nested serializable class', () => {

        class DeepNestedPropertyExtended extends DeepNestedProperty {

          @property()
          public test: number = 0;

          @property()
          public declare extendedProperty: string;

        }

        const instance = create(Test, {
          nestedProperty: {
            deepNestedProperty: create(DeepNestedPropertyExtended, {
              test: 78,
              extendedProperty: 'extended',
            }),
          },
        });

        expect(instance.nestedProperty?.deepNestedProperty?.test)
          .toBe(78);
        expect(instance.nestedProperty?.deepNestedProperty)
          .toBeInstanceOf(DeepNestedPropertyExtended);
        expect(instance.nestedProperty)
          .toBeInstanceOf(NestedProperty);

      });

    });

    describe('class with nested serializable array property descendant of SerializableObject', () => {

      class ArrayItem extends SerializableObject {

        @property()
        public declare test: string;

      }
      class Test extends SerializableObject {

        @property()
        @propertyType(ArrayItem)
        public declare array: ArrayItem[];

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
        expect(instance.array.length)
          .toBe(2);
        expect(instance.array[0])
          .toBeInstanceOf(ArrayItem);
        expect(instance.array[0].test)
          .toBe('123');

      });

      it('should create instance with serializable array property extended item class', () => {

        class ArrayItemExtended extends ArrayItem {

          @property()
          public declare extendedProperty: string;

        }

        const instance = Test.create({
          array: [
            {
              test: '123',
            },
            ArrayItemExtended.create({
              test: '321',
              extendedProperty: 'extended',
            }),
          ],
        });
        expect(instance.array.length)
          .toBe(2);
        expect(instance.array[0])
          .toBeInstanceOf(ArrayItem);
        expect(instance.array[0].test)
          .toBe('123');
        expect(instance.array[1])
          .toBeInstanceOf(ArrayItem);
        expect(instance.array[1])
          .toBeInstanceOf(ArrayItemExtended);
        expect(instance.array[1].test)
          .toBe('321');
        expect((instance.array[1] as ArrayItemExtended).extendedProperty)
          .toBe('extended');

      });

    });

    describe('class with nested serializable array property', () => {

      class ArrayItem {

        @property()
        public declare test: string;

      }
      class Test {

        @property()
        @propertyType(ArrayItem)
        public declare array: ArrayItem[];

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
        expect(instance.array.length)
          .toBe(2);
        expect(instance.array[0])
          .toBeInstanceOf(ArrayItem);
        expect(instance.array[0].test)
          .toBe('123');

      });

      it('should create instance with serializable array property extended item class', () => {

        class ArrayItemExtended extends ArrayItem {

          @property()
          public declare extendedProperty: string;

        }

        const instance = create(Test, {
          array: [
            {
              test: '123',
            },
            create(ArrayItemExtended, {
              test: '321',
              extendedProperty: 'extended',
            }),
          ],
        });
        expect(instance.array.length)
          .toBe(2);
        expect(instance.array[0])
          .toBeInstanceOf(ArrayItem);
        expect(instance.array[0].test)
          .toBe('123');
        expect(instance.array[1])
          .toBeInstanceOf(ArrayItem);
        expect(instance.array[1])
          .toBeInstanceOf(ArrayItemExtended);
        expect(instance.array[1].test)
          .toBe('321');
        expect((instance.array[1] as ArrayItemExtended).extendedProperty)
          .toBe('extended');

      });

    });

    describe('called with serializable class instance descendant of SerializableObject', () => {

      class Property extends SerializableObject {

        @property()
        public declare deepProperty: string;

      }

      class Test extends SerializableObject {

        @property()
        @propertyType(Property)
        public declare property: Property;

      }

      it('should return clone of instance', () => {

        const instance1 = Test.create({
          property: {
            deepProperty: 'test',
          },
        });

        const instance2 = Test.create(instance1);

        expect(instance2)
          .toBeInstanceOf(Test);
        expect(instance2).not.toBe(instance1);
        expect(instance2.property.deepProperty)
          .toBe('test');
        expect(instance2.property)
          .toBeInstanceOf(Property);
        expect(instance2.property).not.toBe(instance1.property);

      });

    });

    describe('called with serializable class instance', () => {

      class Property {

        @property()
        public declare deepProperty: string;

      }

      class Test {

        @property()
        @propertyType(Property)
        public declare property: Property;

      }

      it('should return clone of instance', () => {

        const instance1 = create(Test, {
          property: {
            deepProperty: 'test',
          },
        });

        const instance2 = create(Test, instance1);

        expect(instance2)
          .toBeInstanceOf(Test);
        expect(instance2).not.toBe(instance1);
        expect(instance2.property.deepProperty)
          .toBe('test');
        expect(instance2.property)
          .toBeInstanceOf(Property);
        expect(instance2.property).not.toBe(instance1.property);

      });

    });

  });

});
