import 'reflect-metadata';
import {
  clone,
  create,
  createPartial,
  deserialize,
  ExtractionResult,
  Extractor,
  modifier,
  Modifier,
  OverrideNameExtractor,
  property,
  propertyType,
  SerializableObject,
  serialize,
  SnakeCaseExtractor,
  StraightExtractor,
} from '../src';
import {
  propertyValidators,
  RequiredValidator,
  StringLengthValidator,
  validate,
  ValidationError,
  Validator,
} from '../src/validators';

class Sample {

  constructor(
    private readonly title: string,
    private readonly content: VoidFunction
  ) {
  }

  public run(): void {
    console.log(`\n\x1b[36m# ${this.title}\x1b[0m`);
    this.content();
  }

}

new Sample('BasicUsage', () => {

  class Person {

    @property()
    public declare name: string;

    @property(SnakeCaseExtractor)
    public declare lastName: string;

  }

  const person = deserialize(Person, {
    name: 'John',
    last_name: 'Doe',
  });

  console.log(person instanceof Person); // true
  console.log(person.name); // "John"
  console.log(person.lastName); // "Doe"
  console.log(serialize(person)); // { name: "John", last_name: "Doe" }

}).run();

new Sample('Deep serializable property', () => {
  class Person {

    @property()
    public declare name: string;

    @property(SnakeCaseExtractor)
    public declare lastName: string;

  }

  class Employee {

    @property()
    public declare id: number;

    @property()
    @propertyType(Person)
    public declare person: Person;

  }

  const employee = deserialize(Employee, {
    id: 1,
    person: {
      name: 'John',
      last_name: 'Doe',
    },
  });

  console.log(employee.person); // Person { name: "John", lastName: "Doe" }
}).run();

new Sample('Extend serializable class', () => {

  class Person {
    @property()
    public declare name: string;
  }

  class Employee extends Person {
    @property()
    public declare id: number;
  }

  const employee = deserialize(Employee, {
    id: 1,
    name: 'John',
  });

  console.log(employee); // Employee { name: "John", id: 1 }
}).run();

new Sample('Auto-detect property types', () => {

  class Person {
    @property()
    public declare name: string;
  }

  class Employee {
    @property()
    public declare id: number;

    @property()
    public declare person: Person; // <- Type will be extracted from property metadata
  }

  const employee = deserialize(Employee, {
    id: 1,
    person: {
      name: 'John',
    },
  });

  console.log(employee); // Employee { id: 1, person: Person { name: 'John' } }

}).run();

new Sample('Handle arrays of data', () => {

  class Person {

    @property()
    public declare name: string;

    @property(SnakeCaseExtractor)
    public declare lastName: string;

  }

  class Employee {

    @property()
    public declare id: number;

    @property()
    @propertyType(Person)
    public declare person: Person;

  }

  class Department {

    @property()
    public declare title: string;

    @property()
    @propertyType(Employee)
    public declare employees: Employee[];

  }

  const employees = [
    {
      id: 1,
      person: {
        name: 'John',
        last_name: 'Doe',
      },
    },
    {
      id: 2,
      person: {
        name: 'Jane',
        last_name: 'Doe',
      },
    },
  ].map(e => deserialize(Employee, e));

  console.log(employees.length); // 2
  console.log(employees[0]); // Employee { id: 1, person: Person { name: "John", lastName: "Doe" } }

  const department = deserialize(Department, {
    title: 'Department title',
    employees: [
      {
        id: 1,
        person: {
          name: 'John',
          last_name: 'Doe',
        },
      },
      {
        id: 2,
        person: {
          name: 'Jane',
          last_name: 'Doe',
        },
      },
    ],
  });

  console.dir(department, { depth: 3 }); // Department { title: "Department title", employees [ Employee { id: 1, person: Person { name: "John", lastName: "Doe" } }, Employee { id: 2, person: Person { name: "Jane", lastName: "Doe" } } ] }
  console.dir(serialize(department), { depth: 3 }); // {title: "Department title", employees: [{id: 1, person: {name: "John", last_name: "Doe"}}, {id: 2, person: {name: "Jane", last_name: "Doe"}}]}

}).run();

new Sample('StraightExtractor [Default]', () => {
  class Person {

    @property()
    public declare name: string;

    @property(StraightExtractor) // Same as @property()
    public declare lastName: string;

  }

  const person = deserialize(Person, {
    name: 'John',
    lastName: 'Doe',
  });

  console.log(person); // Person { name: "John", lastName: "Doe" }
}).run();

new Sample('SnakeCaseExtractor', () => {

  class Person {

    @property()
    public declare name: string;

    @property(SnakeCaseExtractor)
    public declare lastName: string;

  }

  const person = deserialize(Person, {
    name: 'John',
    last_name: 'Doe',
  });

  console.log(person); // Person { name: "John", lastName: "Doe" }

}).run();

new Sample('OverrideNameExtractor', () => {

  class Department {

    @property(OverrideNameExtractor.use('department_id'))
    public declare id: string;

  }

  const department = deserialize(Department, {
    department_id: '123',
  });

  console.log(department); // Department { id: "123" }

}).run();

new Sample('Property type basic', () => {

  class Person {

    @property()
    public declare name: string;

    @property(SnakeCaseExtractor)
    public declare lastName: string;

  }

  class Employee {

    @property()
    declare id: number;

    @property()
    @propertyType(Person) // <- Not required if auto-detection types enabled
    public declare person: Person;

  }

  class Department {

    @property()
    @propertyType(Employee) // <- Required because not possible to detect type from property declaration (property metadata seems like Array)
    public declare employees: Employee[];

  }
}).run();

new Sample('Conditional property type', () => {

  class SuccessResult {
    @property()
    public declare data: Record<string, unknown>;
  }
  class FailedResult {
    @property()
    public declare error: string;
  }

  class Response {

    @property()
    @propertyType(SuccessResult, (value: any) => value?.is_success)
    @propertyType(FailedResult, (value: any) => !value?.is_success)
    public declare results: Array<SuccessResult | FailedResult>;

  }

  const response = deserialize(Response, {
    results: [
      {
        is_success: true,
        data: {
          some_data: 'data',
        },
      },
      {
        is_success: false,
        error: 'result error',
      },
    ],
  });

  console.log(response.results[0]); // SuccessResult { data: { some_data: "data" } }
  console.log(response.results[1]); // FailedResult { error: "result error" }

  // For strict type check (fewer possible runtime errors)
  class ResponseWithStrictTypeCheck {

    @property()
    @propertyType(SuccessResult, (value: unknown) => typeof value === 'object'
      && value !== null
      && 'is_success' in value
      && value.is_success === true
    )
    @propertyType(FailedResult, (value: unknown) => typeof value === 'object'
      && value !== null
      && 'is_success' in value
      && value.is_success === false
    )
    public declare results: Array<SuccessResult | FailedResult>;

  }

}).run();

new Sample('Create serializable object', () => {

  class Person {

    @property()
    public declare lastName: string;

    @property()
    public declare firstName: string;

  }

  // Recommended instead of createPartial()
  const person = create(Person, {
    firstName: 'John',
    lastName: 'Doe',
  });
  console.log(person); // Person { firstName: "John", lastName: "Doe" }

  const partialPerson = createPartial(Person);
  console.log(partialPerson); // Person { }

}).run();

new Sample('Clone serializable object', () => {
  class Person {

    @property()
    public declare lastName: string;

    @property()
    public declare firstName: string;

  }

  const person = create(Person, {
    firstName: 'John',
    lastName: 'Doe',
  });

  const personClone = clone(person);

  console.log(personClone); // Person { firstName: "John", lastName: "Doe" }
  console.log(person === personClone); // false
}).run();

new Sample('Serialize serializable object', () => {
  class Person {

    @property(SnakeCaseExtractor)
    public declare lastName: string;

    @property(SnakeCaseExtractor)
    public declare firstName: string;

  }

  const person = create(Person, {
    firstName: 'John',
    lastName: 'Doe',
  });

  console.log(serialize(person)); // { first_name: "John", last_name: "Doe" }
}).run();

new Sample('Transform property value (type mismatch)', () => {

  class StringAgeModifier extends Modifier {
    public onSerialize(data: number): string {
      return String(data);
    }
    public onDeserialize(data: string): number {
      return Number(data);
    }
  }

  class Person {

    @property()
    @modifier(StringAgeModifier)
    public declare age: number;

  }

  const person = deserialize(Person, {
    age: '25',
  });

  console.log(person); // Person { age: 25 }
  console.log(typeof person.age); // number;
  console.log(serialize(person)); // { age: "25" }
}).run();

new Sample('Transform property value format', () => {

  // Like if database required full string date format
  class BirthDateModifier extends Modifier {
    public onSerialize(value: string): string {
      return new Date(value).toISOString();
    }
  }

  class Person {

    @property()
    @modifier(BirthDateModifier)
    public declare birthDate: string;

  }

  const person = create(Person, {
    birthDate: '2000-05-06',
  });


  console.log(person); // Person { birthDate: "2000-05-06"}
  console.log(serialize(person)); // { birthDate: "2000-05-06T00:00:00.000Z" }
}).run();

new Sample('PrivateSnakeCaseExtractor', () => {
  /* Extract value from `snake_case` property to "private" `camelCase` property  */
  class PrivateSnakeCaseExtractor extends SnakeCaseExtractor {
    constructor(
      key: string,
      modifier?: Modifier,
    ) {
      super(
        key.replace(/^_/, ''),
        modifier,
      );
    }
  }

  class Department {

    @property(PrivateSnakeCaseExtractor)
    private declare _departmentId: string;

  }

  const department = deserialize(Department, {
    department_id: '123',
  });

  console.log(department); // Department { _departmentId: "123" }
}).run();


new Sample('DeepExtractor', () => {

  /* Extract value from deep object (transform to plane object) */
  class DeepExtractor extends Extractor {

    public static byPath<C extends typeof DeepExtractor>(path: string): C {
      return class extends DeepExtractor {
        constructor(_: string, modifier?: Modifier) {
          super(path, modifier);
        }
      } as any;
    }

    private static getObjectByPath(dataObject: any, keys: string[]): any {
      let extracted: any = dataObject;
      keys.forEach(key => {
        if (!extracted) {
          return undefined;
        }
        extracted = (extracted as any)[key];
      });
      return extracted;
    }

    private static getOrCreateObjectByPath(dataObject: any, keys: string[]): any {
      let currentObject = dataObject;
      keys.forEach(key => {
        if (!currentObject.hasOwnProperty(key)) {
          currentObject[key] = {};
        }
        currentObject = currentObject[key];
      });
      return currentObject;
    }

    constructor(
      key: string,
      modifier?: Modifier,
    ) {
      super(key, modifier);
    }

    public extract(data: any): ExtractionResult {
      if (typeof data !== 'object' || data === null) {
        return {
          data: undefined,
          path: this.key,
        };
      }
      return {
        data: this.modifier.onDeserialize(
          DeepExtractor.getObjectByPath(data, this.key.split('.')),
        ),
        path: this.key,
      };
    }

    public apply(applyObject: any, value: unknown): void {
      const keys = this.key.split('.');
      const dataObject = DeepExtractor.getOrCreateObjectByPath(applyObject, keys.slice(0, -1));
      dataObject[keys[keys.length - 1]] = this.modifier.onSerialize(value);
    }

  }

  class AgeModifier extends Modifier {
    public onDeserialize(value: string): number {
      return Number(value);
    }
    public onSerialize(value: number): string {
      return String(value);
    }
  }

  class Person {

    @property()
    public declare id: number;

    @property(DeepExtractor.byPath('data.person.age'))
    @modifier(AgeModifier)
    public declare age: number;

    @property(DeepExtractor.byPath('data.person.last_name'))
    public declare lastName: string;

    @property(DeepExtractor.byPath('data.person.first_name'))
    public declare firstName: string;

  }

  const person = deserialize(Person, {
    id: 123,
    data: {
      person: {
        age: '25',
        last_name: 'John',
        first_name: 'Doe',
      },
    },
  });

  console.log(person); // Person { lastName: "John", id: 123, age: 25, firstName: "Doe" }

  console.log(serialize(person)); // { id : 123, data: { person: {age: "25", last_name: "John", first_name: "Doe" } } }
}).run();

new Sample('Only deserializable property by extractor', () => {

  class OnlyDeserializeStraightExtractor extends StraightExtractor {
    public apply(applyObject: any, value: unknown): void {
    }
  }

  class Department {
    @property(OnlyDeserializeStraightExtractor)
    public declare id: number;

    @property()
    public declare title: string;
  }

  const department = deserialize(Department, {
    id: 123,
    title: 'Department title',
  });
  console.log(department); // Department { id: 123, title: "Department title" }

  console.log(serialize(department)); // { title: "Department title" }
}).run();

new Sample('Only deserializable property by modifier', () => {

  class OnlyDeserializableModifier extends Modifier {
    public onSerialize(value: unknown): undefined {
      return undefined;
    }
    public onDeserialize(data: unknown): unknown {
      return data;
    }
  }

  class Department {
    @property()
    @modifier(OnlyDeserializableModifier)
    public declare id: number;

    @property()
    public declare title: string;
  }

  const department = deserialize(Department, {
    id: 123,
    title: 'Department title',
  });
  console.log(department); // Department { id: 123, title: "Department title" }

  console.log(serialize(department)); // { title: "Department title" }
}).run();

new Sample('Getters and setters', () => {
  class PersonWithGetter {
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

  const personWithGetter = new PersonWithGetter('John', 'Doe');
  console.log(serialize(personWithGetter)); // { fullName: "John Doe" }

  class PersonWithSetter {
    public declare firstName: string;
    public declare lastName: string;

    @property()
    public set fullName(value: string) {
      const [firstName, lastName] = value.split(' ');
      this.firstName = firstName;
      this.lastName = lastName;
    }
  }

  const deserialized = deserialize(PersonWithSetter, {
    fullName: 'John Doe',
  });

  console.log(deserialized); // PersonWithSetter { firstName: "John", lastName: "Doe" }
}).run();

new Sample('Syntactic sugar - SerializableObject class', () => {
  class Item extends SerializableObject {
    @property()
    public declare id: number;
    @property()
    public declare title: string;
  }

  const items = Item.deserializeArray([
    {
      id: 1,
      title: 'First item',
    },
    {
      id: 2,
      title: 'Second item',
    },
  ]);
  console.log(items); // [ Item { id: 1, title: "First item" }, Item { id: 2, title: "Second item" } ]

  const firstItem = items[0];
  const firstItemClone = firstItem.clone();
  console.log(firstItemClone); // Item { id: 1, title: "First item" }
  console.log(firstItemClone === firstItem); // false
  console.log(firstItemClone.serialize()); // { id: 1, title: 'First item' }

  const newItem = Item.create({
    id: 3,
    title: 'New item',
  });
  console.log(newItem); // Item { id: 3, title: "New item" }
}).run();

new Sample('Basic validation', () => {
  class Person {
    @property()
    @propertyValidators([RequiredValidator, StringLengthValidator.with({ min: 1 })])
    public declare name: string;
  }

  const resultRequired = validate(Person, {});
  console.log(resultRequired); // [ ValidationError { message: "Property is required", path: "name" } ]

  const resultEmpty = validate(Person, {
    name: '',
  });
  console.log(resultEmpty); // [ ValidationError { message: "Property length should be greater than or equal 1", path: "name" } ]
}).run();

new Sample('deep validation', () => {
  class Address {
    @property()
    @propertyValidators([RequiredValidator])
    public declare city: string;
  }

  class Employee {
    @property()
    @propertyValidators([RequiredValidator])
    public declare name: string;

    @property()
    @propertyValidators([RequiredValidator])
    @propertyType(Address)
    public declare address: Address;
  }

  class Department {
    @property(OverrideNameExtractor.use('department_employees'))
    @propertyType(Employee)
    public declare employees: Employee[];
  }

  class Organization {

    @property()
    @propertyType(Department)
    public declare departments: Department[];

  }

  const data = {
    departments: [
      {
        department_employees: [
          {
            name: 'John Doe',
            address: {
              city: 'New York',
            },
          },
          {
            address: {
              city: 'London',
            },
          },
        ],
      },
      {
        department_employees: [
          {
            name: 'Jane Doe',
            address: {
            },
          },
          {
            name: 'Jane Smith',
            address: {
              city: 'Berlin',
            },
          },
        ],
      },
    ],
  };

  const validationResult = validate(Organization, data);

  console.log(validationResult); // [ ValidationError { message: 'Property is required', path: "departments.[0].department_employees.[1].name" }, ValidationError { message: "Property is required", path: "departments.[1].department_employees.[0].address.city" } ]
}).run();

new Sample('Custom validator', () => {

  class VINValidator extends Validator {
    public validate(value: unknown, path: string): ValidationError | undefined {
      if (typeof value !== 'string') {
        return;
      }
      if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(value)) {
        return new ValidationError('Invalid VIN', path);
      }
    }
  }

  class Vehicle {
    @property()
    @propertyValidators([VINValidator])
    public declare vin: string;
  }

  const validationResult = validate(Vehicle, { vin: '345435' });

  console.log(validationResult); // [ ValidationError { message: "Invalid VIN", path: "vin" } ]

}).run();

new Sample('Custom validation error', () => {

  class PasswordCriticalValidationError extends ValidationError {
    constructor(
      path: string,
    ) {
      super('Password too short', path);
    }
  }

  class PasswordWarnValidationError extends ValidationError {
    constructor(
      path: string,
    ) {
      super('Password is weak', path);
    }
  }

  class PasswordValidator extends Validator {

    public validate(value: unknown, path: string): ValidationError | undefined {
      if (typeof value !== 'string') {
        return;
      }

      if (value.length < 4) {
        return new PasswordCriticalValidationError(path);
      }

      if (value.length < 6) {
        return new PasswordWarnValidationError(path);
      }
    }
  }

  class LoginCredentials {
    @property()
    @propertyValidators([PasswordValidator])
    public declare password: string;
  }

  const shortPasswordResult = validate(LoginCredentials, { password: '123' });
  console.log(shortPasswordResult); // [ PasswordCriticalValidationError { message: "Password too short", path: "password" } ]

  const weakPasswordResult = validate(LoginCredentials, { password: '12345' });
  console.log(weakPasswordResult); // [ PasswordWarnValidationError { message: "Password is weak", path: "password" } ]

  const criticalErrors = weakPasswordResult.filter(error => !(error instanceof PasswordWarnValidationError));
  console.log(criticalErrors); // []

}).run();
