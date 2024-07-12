import {
  deserialize,
  property,
  SerializableObject,
  serialize,
  SnakeCaseExtractor,
  StraightExtractor,
} from '../src';

describe('Common', () => {

  describe('simple class', () => {

    it('child should not affect parent class', () => {

      class Test {
        @property(SnakeCaseExtractor)
        public stringValue?: string;
      }

      class TestChild extends Test {
        @property(SnakeCaseExtractor)
        public numberValue?: number;
      }

      const testDeserialized = deserialize(TestChild, {
        string_value: 'string',
        number_value: 123,
      });

      expect(testDeserialized.numberValue).toBe(123);

      const parentInstance = deserialize(Test, {
        string_value: 'string',
        number_value: 123,
      });

      expect(parentInstance).not.toHaveProperty('numberValue');

      (parentInstance as any)['numberValue'] = 321;

      const serializedParent = serialize(parentInstance);
      expect(serializedParent).toEqual({
        string_value: 'string',
      });
      expect(serializedParent).not.toHaveProperty('number_value');

    });

    it('should extend parent serializable properties even if class doesn\'t has own properties', () => {

      class Test {
        @property(SnakeCaseExtractor)
        public testProperty?: string;
      }

      class SubTest extends Test { }

      class SubSubTest extends SubTest { }

      const deserialized = deserialize(SubSubTest, {
        test_property: 'value',
      });

      expect(deserialized.testProperty).toBe('value');
      expect(deserialized).toBeInstanceOf(SubSubTest);

      const serialized = serialize(deserialized);

      expect(serialized).toEqual({
        test_property: 'value',
      });

    });

    describe('setters and getters', () => {

      it('should serialize and deserialize getter + setter properties', () => {

        class Person {

          constructor(
            public firstName: string,
            public lastName: string,
          ) {
          }

          @property()
          public get fullName(): string {
            return this.firstName + ' ' + this.lastName;
          }

          public set fullName(value: string) {
            const [firstName, lastName] = value.split(' ');
            this.firstName = firstName;
            this.lastName = lastName;
          }

        }

        const instance = new Person('John', 'Doe');
        expect(serialize(instance)).toEqual({
          fullName: 'John Doe',
        });

        const deserialized = deserialize(Person, {
          fullName: 'John Doe',
        });
        expect(deserialized.firstName).toBe('John');
        expect(deserialized.lastName).toBe('Doe');

      });

      describe('getter', () => {

        class Person {

          constructor(
            public firstName: string,
            public lastName: string,
          ) {
          }

          @property()
          public get fullName(): string {
            return this.firstName + ' ' + this.lastName;
          }

        }

        it('should serialize getter property', () => {
          const instance = new Person('John', 'Doe');
          expect(serialize(instance)).toEqual({
            fullName: 'John Doe',
          });
        });

        it('should not throw error on deserialize getter property', () => {
          expect(() => deserialize(Person, {
            fullName: 'John Doe',
          })).not.toThrowError();
        });

      });

      describe('setter', () => {

        class Person {

          constructor(
            public firstName: string,
            public lastName: string,
          ) {
          }

          @property()
          public set fullName(value: string) {
            const [firstName, lastName] = value.split(' ');
            this.firstName = firstName;
            this.lastName = lastName;
          }

        }

        it('should deserialize setter property', () => {
          const deserialized = deserialize(Person, {
            fullName: 'John Doe',
          });
          expect(deserialized.firstName).toBe('John');
          expect(deserialized.lastName).toBe('Doe');
        });

        it('should not serialize setter property', () => {
          const instance = new Person('John', 'Doe');
          expect(serialize(instance)).toEqual({});
        });

        it('should not throw error on serialize setter property', () => {
          const instance = new Person('John', 'Doe');
          expect(() => serialize(instance)).not.toThrowError();
        });

      });

    });

  });

  describe('Descendant of SerializableObject', () => {

    it('child should not affect parent class', () => {

      class Test extends SerializableObject {
        @property(SnakeCaseExtractor)
        public stringValue?: string;
      }

      class TestChild extends Test {
        @property(SnakeCaseExtractor)
        public numberValue?: number;
      }

      const testDeserialized = TestChild.deserialize({
        string_value: 'string',
        number_value: 123,
      });

      expect(testDeserialized.numberValue).toBe(123);

      const parentInstance = Test.deserialize({
        string_value: 'string',
        number_value: 123,
      });

      expect(parentInstance).not.toHaveProperty('numberValue');

      (parentInstance as any)['numberValue'] = 321;

      const serializedParent = parentInstance.serialize();
      expect(serializedParent).toEqual({
        string_value: 'string',
      });
      expect(serializedParent).not.toHaveProperty('number_value');

    });

    it('should extend parent serializable properties even if class doesn\'t has own properties', () => {

      class Test extends SerializableObject {
        @property(SnakeCaseExtractor)
        public testProperty?: string;
      }

      class SubTest extends Test { }

      class SubSubTest extends SubTest { }

      const deserialized = SubSubTest.deserialize({
        test_property: 'value',
      });

      expect(deserialized.testProperty).toBe('value');
      expect(deserialized).toBeInstanceOf(SubSubTest);

      const serialized = deserialized.serialize();

      expect(serialized).toEqual({
        test_property: 'value',
      });

    });

    describe('setters and getters', () => {

      it('should serialize and deserialize getter + setter properties', () => {

        class Person extends SerializableObject {

          @property(StraightExtractor.transform({
            onSerialize: () => { },
            onDeserialize: () => { },
          }))
          public firstName?: string;
          @property(StraightExtractor.transform({
            onSerialize: () => { },
            onDeserialize: () => { },
          }))
          public lastName?: string;

          @property()
          public get fullName(): string {
            return this.firstName + ' ' + this.lastName;
          }

          public set fullName(value: string) {
            const [firstName, lastName] = value.split(' ');
            this.firstName = firstName;
            this.lastName = lastName;
          }

        }

        const instance = Person.create({
          firstName: 'John',
          lastName: 'Doe',
        });
        expect(instance.serialize()).toEqual({
          fullName: 'John Doe',
        });

        const deserialized = Person.deserialize({
          fullName: 'John Doe',
        });
        expect(deserialized.firstName).toBe('John');
        expect(deserialized.lastName).toBe('Doe');

      });

      describe('getter', () => {

        class Person extends SerializableObject {

          @property(StraightExtractor.transform({
            onSerialize: () => { },
          }))
          public firstName?: string;
          @property(StraightExtractor.transform({
            onSerialize: () => { },
          }))
          public lastName?: string;

          @property()
          public get fullName(): string {
            return this.firstName + ' ' + this.lastName;
          }

        }

        it('should serialize getter property', () => {
          const instance = Person.create({
            firstName: 'John',
            lastName: 'Doe',
          });
          expect(instance.serialize()).toEqual({
            fullName: 'John Doe',
          });
        });

        it('should not throw error on deserialize getter property', () => {
          expect(() => Person.deserialize({
            fullName: 'John Doe',
          })).not.toThrowError();
        });

      });

      describe('setter', () => {

        class Person extends SerializableObject {

          @property(StraightExtractor.transform({
            onDeserialize: () => { },
            onSerialize: () => { },
          }))
          public firstName?: string;
          @property(StraightExtractor.transform({
            onDeserialize: () => { },
            onSerialize: () => { },
          }))
          public lastName?: string;

          @property()
          public set fullName(value: string) {
            const [firstName, lastName] = value.split(' ');
            this.firstName = firstName;
            this.lastName = lastName;
          }

        }

        it('should deserialize setter property', () => {
          const deserialized = Person.deserialize({
            fullName: 'John Doe',
          });
          expect(deserialized.firstName).toBe('John');
          expect(deserialized.lastName).toBe('Doe');
        });

        it('should not serialize setter property', () => {
          const instance = Person.create({
            firstName: 'John',
            lastName: 'Doe',
          });
          expect(serialize(instance)).toEqual({});
        });

        it('should not throw error on serialize setter property', () => {
          const instance = Person.create({
            firstName: 'John',
            lastName: 'Doe',
          });
          expect(() => serialize(instance)).not.toThrowError();
        });

      });

    });

  });

});
