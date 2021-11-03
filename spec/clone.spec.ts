import { property } from '../src/decorators/property/property';
import { SerializableObject } from '../src/serializable-object';

describe('Clone', () => {

  class Property extends SerializableObject {
    @property()
    public deepProperty: string;
  }

  class Test extends SerializableObject {
    @property()
    public property: Property;
  }

  it('should return new class instance with same values', () => {

    const instance1 = Test.create({
      property: {
        deepProperty: 'test',
      },
    });

    const instance2 = instance1.clone();

    expect(instance2).toBeInstanceOf(Test);
    expect(instance2).not.toBe(instance1);
    expect(instance2.property.deepProperty).toBe('test');
    expect(instance2.property).toBeInstanceOf(Property);
    expect(instance2.property).not.toBe(instance1.property);

  });


});
