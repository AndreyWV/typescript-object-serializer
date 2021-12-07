import { property, SerializableObject } from '../src';

describe('Serializable class constructor', () => {

  it('should extend serializable properties from parent', () => {

    class Person extends SerializableObject {
      @property()
      public name: string;
    }

    class User extends Person {
      @property()
      public id: number;
    }

    const user = User.deserialize({
      name: 'John',
      id: 1,
    });

    expect(user.name).toBe('John');

    const serialized = user.serialize();

    expect(serialized).toEqual({name: 'John', id: 1});

  });

});
