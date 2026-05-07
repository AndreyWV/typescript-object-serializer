import { property } from '../src/core/decorators/property';
import { propertyType } from '../src/core/decorators/property-type';
import { clone } from '../src/core/methods/clone';
import { create } from '../src/core/methods/create';
import { SerializableObject } from '../src/serializable-object';

describe('Clone', () => {

  describe('descendant of SerializableObject', () => {

    class Property extends SerializableObject {

      @property()
      public declare deepProperty: string;

    }

    class Test extends SerializableObject {

      @property()
      @propertyType(Property)
      public declare property: Property;

      @property()
      @propertyType(Property)
      public declare arrayOfProperty: Property[];

      @property()
      public declare arrayOfStrings: string[];

      @property()
      public declare arrayOfNumbers: number[];

      @property()
      public declare arrayOfBooleans: boolean[];

      @property()
      public declare arrayOfAny: any[];

    }

    it('should return new class instance with same values', () => {

      const instance1 = Test.create({
        property: {
          deepProperty: 'test',
        },
        arrayOfProperty: [
          {
            deepProperty: '1',
          },
          {
            deepProperty: '2',
          },
        ],
        arrayOfStrings: [
          'value-1',
          'value-2',
        ],
        arrayOfNumbers: [
          3,
          4,
        ],
        arrayOfBooleans: [
          false,
          true,
        ],
        arrayOfAny: [
          false,
          true,
          3,
          5,
          'string',
          {
            key: 'value',
          },
          create(Property, {
            deepProperty: 'test',
          }),
          null,
        ] as any[],
      });

      const instance2 = instance1.clone();

      expect(instance2)
        .toBeInstanceOf(Test);
      expect(instance2).not.toBe(instance1);
      expect(instance2.property.deepProperty)
        .toBe('test');
      expect(instance2.property)
        .toBeInstanceOf(Property);
      expect(instance2.property).not.toBe(instance1.property);
      expect(instance2.arrayOfProperty.length)
        .toBe(2);
      expect(instance2.arrayOfProperty[0])
        .toBeInstanceOf(Property);
      expect(instance2.arrayOfProperty[0].deepProperty)
        .toBe('1');
      expect(instance2.arrayOfStrings.length)
        .toBe(2);
      expect(instance2.arrayOfStrings[0])
        .toBe('value-1');
      expect(instance2.arrayOfStrings[1])
        .toBe('value-2');
      expect(instance2.arrayOfNumbers.length)
        .toBe(2);
      expect(instance2.arrayOfNumbers[0])
        .toBe(3);
      expect(instance2.arrayOfNumbers[1])
        .toBe(4);
      expect(instance2.arrayOfBooleans.length)
        .toBe(2);
      expect(instance2.arrayOfBooleans[0])
        .toBe(false);
      expect(instance2.arrayOfBooleans[1])
        .toBe(true);

      expect(instance2.arrayOfAny.length)
        .toBe(8);
      expect(instance2.arrayOfAny[0])
        .toBe(false);
      expect(instance2.arrayOfAny[1])
        .toBe(true);
      expect(instance2.arrayOfAny[2])
        .toBe(3);
      expect(instance2.arrayOfAny[3])
        .toBe(5);
      expect(instance2.arrayOfAny[4])
        .toBe('string');
      expect(instance2.arrayOfAny[5])
        .toEqual({
          key: 'value',
        });
      expect(instance2.arrayOfAny[5])
        .toBe(instance1.arrayOfAny[5]);
      expect(instance2.arrayOfAny[6])
        .toBeInstanceOf(Property);
      expect(instance2.arrayOfAny[6].deepProperty)
        .toBe('test');
      expect(instance2.arrayOfAny[6]).not.toBe(instance1.arrayOfAny[6]);
      expect(instance2.arrayOfAny[7])
        .toBe(null);

    });

  });

  describe('simple class', () => {

    class Property {

      @property()
      public declare deepProperty: string;

    }

    class Test {

      @property()
      @propertyType(Property)
      public declare property: Property;

      @property()
      @propertyType(Property)
      public declare arrayOfProperty: Property[];

      @property()
      public declare arrayOfStrings: string[];

      @property()
      public declare arrayOfNumbers: number[];

      @property()
      public declare arrayOfBooleans: boolean[];

      @property()
      public declare arrayOfAny: any[];

    }

    it('should return new class instance with same values', () => {

      const instance1 = create(Test, {
        property: {
          deepProperty: 'test',
        },
        arrayOfProperty: [
          {
            deepProperty: '1',
          },
          {
            deepProperty: '2',
          },
        ],
        arrayOfStrings: [
          'value-1',
          'value-2',
        ],
        arrayOfNumbers: [
          3,
          4,
        ],
        arrayOfBooleans: [
          false,
          true,
        ],
        arrayOfAny: [
          false,
          true,
          3,
          5,
          'string',
          {
            key: 'value',
          },
          create(Property, {
            deepProperty: 'test',
          }),
          null,
        ] as any[],
      });

      const instance2 = clone(instance1);

      expect(instance2)
        .toBeInstanceOf(Test);
      expect(instance2).not.toBe(instance1);
      expect(instance2.property.deepProperty)
        .toBe('test');
      expect(instance2.property)
        .toBeInstanceOf(Property);
      expect(instance2.property).not.toBe(instance1.property);
      expect(instance2.arrayOfProperty.length)
        .toBe(2);
      expect(instance2.arrayOfProperty[0])
        .toBeInstanceOf(Property);
      expect(instance2.arrayOfProperty[0].deepProperty)
        .toBe('1');
      expect(instance2.arrayOfStrings.length)
        .toBe(2);
      expect(instance2.arrayOfStrings[0])
        .toBe('value-1');
      expect(instance2.arrayOfStrings[1])
        .toBe('value-2');
      expect(instance2.arrayOfNumbers.length)
        .toBe(2);
      expect(instance2.arrayOfNumbers[0])
        .toBe(3);
      expect(instance2.arrayOfNumbers[1])
        .toBe(4);
      expect(instance2.arrayOfBooleans.length)
        .toBe(2);
      expect(instance2.arrayOfBooleans[0])
        .toBe(false);
      expect(instance2.arrayOfBooleans[1])
        .toBe(true);

      expect(instance2.arrayOfAny.length)
        .toBe(8);
      expect(instance2.arrayOfAny[0])
        .toBe(false);
      expect(instance2.arrayOfAny[1])
        .toBe(true);
      expect(instance2.arrayOfAny[2])
        .toBe(3);
      expect(instance2.arrayOfAny[3])
        .toBe(5);
      expect(instance2.arrayOfAny[4])
        .toBe('string');
      expect(instance2.arrayOfAny[5])
        .toEqual({
          key: 'value',
        });
      expect(instance2.arrayOfAny[5])
        .toBe(instance1.arrayOfAny[5]);
      expect(instance2.arrayOfAny[6])
        .toBeInstanceOf(Property);
      expect(instance2.arrayOfAny[6].deepProperty)
        .toBe('test');
      expect(instance2.arrayOfAny[6]).not.toBe(instance1.arrayOfAny[6]);
      expect(instance2.arrayOfAny[7])
        .toBe(null);

    });

  });

});
