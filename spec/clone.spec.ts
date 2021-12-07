import { propertyType } from '../src/decorators/property-type/type';
import { property } from '../src/decorators/property/property';
import { SerializableObject } from '../src/serializable-object';

describe('Clone', () => {

  class Property extends SerializableObject {
    @property()
    public deepProperty: string;
  }

  class Test extends SerializableObject {
    @property()
    @propertyType(Property)
    public property: Property;

    @property()
    @propertyType(Property)
    public arrayOfProperty: Property[];
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
    });

    const instance2 = instance1.clone();

    expect(instance2).toBeInstanceOf(Test);
    expect(instance2).not.toBe(instance1);
    expect(instance2.property.deepProperty).toBe('test');
    expect(instance2.property).toBeInstanceOf(Property);
    expect(instance2.property).not.toBe(instance1.property);
    expect(instance2.arrayOfProperty.length).toBe(2);
    expect(instance2.arrayOfProperty[0]).toBeInstanceOf(Property);
    expect(instance2.arrayOfProperty[0].deepProperty).toBe('1');

  });

});
