import { property } from '../src/decorators/property';
import { deserialize } from '../src/methods/deserialize';
import { serialize } from '../src/methods/serialize';
import { SerializableObject } from '../src/serializable-object';

describe('Serializable class constructor', () => {

  describe('should extend serializable properties from parent', () => {

    it('descendant of SerializableObject', () => {
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

      expect(serialized).toEqual({ name: 'John', id: 1 });
    });

    it('simple class', () => {
      class Person {
        @property()
        public name: string;
      }

      class User extends Person {
        @property()
        public id: number;
      }

      const user = deserialize(User, {
        name: 'John',
        id: 1,
      });

      expect(user.name).toBe('John');

      const serialized = serialize(user);

      expect(serialized).toEqual({ name: 'John', id: 1 });
    });

  });

});
