import 'reflect-metadata';
import {
  property,
  SerializableObject,
} from '../src';

describe('Property type auto-detection', () => {

  class Property extends SerializableObject {
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
