import 'reflect-metadata';
import {
  clone,
  create,
  deserialize,
  ExtractionResult,
  Extractor,
  OverrideNameExtractor,
  propertyType,
  SerializableObject,
  serialize,
  SnakeCaseExtractor,
  StraightExtractor,
} from '../src';
import { property } from '../src/decorators/property';
import {
  propertyValidators,
  RequiredValidator,
  SerializableObjectWithValidation,
  StringLengthValidator,
  validate,
  ValidationError,
  Validator,
} from '../src/validators';

// Basic usage
(() => {

  console.log('Basic usage');

  class Person {

    @property()
    public name: string;

    @property(SnakeCaseExtractor)
    public lastName: string;

  }

  const person = deserialize(Person, {
    name: 'John',
    last_name: 'Doe',
  });

  console.log(person instanceof Person); // true
  console.log(person.name); // "John"
  console.log(person.lastName); // "Doe"
  console.log(serialize(person)) // { name: "John", last_name: "Doe" }
})();

// Deep serializable property
(() => {

  console.log(' Deep serializable property');

  class Person {

    @property()
    public name: string;

    @property(SnakeCaseExtractor)
    public lastName: string;

  }

  class Employee {

    @property()
    id: number;

    @property()
    @propertyType(Person)
    public person: Person;

  }

  const employee = deserialize(Employee, {
    id: 1,
    person: {
      name: 'John',
      last_name: 'Doe',
    },
  });

  console.log(employee.person); // Person { name: "John", lastName: "Doe" }
})();

// Extend serializable class
(() => {

  console.log('Extend serializable class');

  class Person {
    @property()
    public name: string;
  }

  class Employee extends Person {
    @property()
    id: number;
  }

  const employee = deserialize(Employee, {
    id: 1,
    name: 'John',
  });

  console.log(employee); // Employee { name: "John", id: 1 }
})();

// Auto-detect property types
(() => {

  console.log('Auto-detect property types');

  class Person {
    @property()
    public name: string;
  }

  class Employee {
    @property()
    public id: number;

    @property()
    public person: Person; // <- Type will be extracted from property metadata
  }

  const employee = deserialize(Employee, {
    id: 1,
    person: {
      name: 'John',
    },
  });

  console.log(employee); // Employee { id: 1, person: Person { name: 'John' } }
})();

// Handle arrays of data
(() => {

  console.log('Handle arrays of data');

  class Person {

    @property()
    public name: string;

    @property(SnakeCaseExtractor)
    public lastName: string;

  }

  class Employee {

    @property()
    id: number;

    @property()
    @propertyType(Person)
    public person: Person;

  }

  class Department {

    @property()
    public title: string;

    @property()
    @propertyType(Employee)
    public employees: Employee[];

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

  console.log(department); // Department { title: "Department title", employees [ Employee { id: 1, person: Person { name: "John", lastName: "Doe" } }, Employee { id: 2, person: Person { name: "Jane", lastName: "Doe" } } ] }
  console.log('serialized department', serialize(department)); // {title: "Department title", employees: [{id: 1, person: {name: "John", last_name: "Doe"}}, {id: 2, person: {name: "Jane", last_name: "Doe"}}]}
})();

// StraightExtractor [Default]
(() => {

  console.log('StraightExtractor [Default]');

  class Person {

    @property()
    public name: string;

    @property(StraightExtractor) // Same as @property()
    public lastName: string;

  }

  const person = deserialize(Person, {
    name: 'John',
    lastName: 'Doe',
  });

  console.log(person); // Person { name: "John", lastName: "Doe" }
})();

// SnakeCaseExtractor
(() => {

  console.log('SnakeCaseExtractor');

  class Person {

    @property()
    public name: string;

    @property(SnakeCaseExtractor)
    public lastName: string;

  }

  const person = deserialize(Person, {
    name: 'John',
    last_name: 'Doe',
  });

  console.log(person); // Person { name: "John", lastName: "Doe" }
})();

// OverrideNameExtractor
(() => {

  console.log('OverrideNameExtractor');

  class Department {

    @property(OverrideNameExtractor.use('department_id'))
    public id: string;

  }

  const department = deserialize(Department, {
    department_id: '123',
  });

  console.log(department); // Department { id: "123" }
})();

// Property type basic
(() => {

  console.log('Property type basic');

  class Person {

    @property()
    public name: string;

    @property(SnakeCaseExtractor)
    public lastName: string;

  }

  class Employee {

    @property()
    id: number;

    @property()
    @propertyType(Person) // <- Not required if auto-detection types enabled
    public person: Person;

  }

  class Department {

    @property()
    @propertyType(Employee) // <- Required because not possible to detect type from property declaration (property metadata seems like Array)
    public employees: Employee[];

  }
})();

// Conditional property type
(() => {

  console.log('Conditional property type');

  class SuccessResult {
    @property()
    public data: any;
  }
  class FailedResult {
    @property()
    public error: string;
  }

  class Response {

    @property()
    @propertyType(value => value?.is_success ? SuccessResult : FailedResult)
    public results: Array<SuccessResult | FailedResult>;

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
})();

// Create serializable object
(() => {

  console.log('Create serializable object');

  class Person {

    @property()
    public lastName: string;

    @property()
    public firstName: string;

  }

  const person = create(Person);
  console.log(person); // Person { }

  const personWithData = create(Person, {
    firstName: 'John',
    lastName: 'Doe',
  });
  console.log(personWithData); // Person { firstName: "John", lastName: "Doe" }

})();

// Clone serializable object
(() => {

  console.log('Clone serializable object');

  class Person {

    @property()
    public lastName: string;

    @property()
    public firstName: string;

  }

  const person = create(Person, {
    firstName: 'John',
    lastName: 'Doe',
  });

  const personClone = clone(person);

  console.log(personClone); // Person { firstName: "John", lastName: "Doe" }
  console.log(person === personClone); // false
})();

// Serialize serializable object
(() => {

  console.log('Serialize serializable object');

  class Person {

    @property(SnakeCaseExtractor)
    public lastName: string;

    @property(SnakeCaseExtractor)
    public firstName: string;

  }

  const person = create(Person, {
    firstName: 'John',
    lastName: 'Doe',
  });

  console.log(serialize(person)); // { first_name: "John", last_name: "Doe" }
})();

// Transform property value (type mismatch)
(() => {

  console.log('Transform property value (type mismatch)');

  class Person {

    @property(StraightExtractor.transform({
      onDeserialize: value => Number(value),
      onSerialize: value => String(value),
    }))
    public age: number;

  }

  const person = deserialize(Person, {
    age: '25',
  });

  console.log(person); // Person { age: 25 }
  console.log(typeof person.age); // number;
  console.log(serialize(person)); // { age: "25" }
})();

// Transform property value (class or any other type)
(() => {

  console.log('Transform property value (class or any other type)');

  class DepartmentId {

    constructor(
      public value: string,
    ) {
    }

    // Some DepartmentId logic

  }

  class Department {

    @property(StraightExtractor.transform({
      onDeserialize: value => new DepartmentId(value),
      onSerialize: (value: DepartmentId) => value?.value,
    }))
    public id: DepartmentId; // <- Non-serializable object type

  }

  const department = deserialize(Department, {
    id: '1',
  });

  console.log(department); // Department { id: DepartmentId { value: "1" } }
  console.log(serialize(department)); // { id: "1" }
})();

// Custom extractor
(() => {

  console.log('Custom extractor');

  /* Extract value from `snake_case` property to "private" `camelCase` property  */
  class PrivateSnakeCaseExtractor<T> extends SnakeCaseExtractor<T> {
    constructor(
      key: string,
    ) {
      super(key.replace(/^_/, ''));
    }
  }

  class Department {

    @property(PrivateSnakeCaseExtractor)
    private _departmentId: string;

  }

  const department = deserialize(Department, {
    department_id: '123',
  });

  console.log(department); // Department { _departmentId: "123" }

  /* Extract value from deep object (transform to plane object) */
  class DeepExtractor<T = any> extends Extractor<T> {

    public static byPath<C extends typeof DeepExtractor>(path: string): C {
      return class extends DeepExtractor {
        constructor() {
          super(path);
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
      protected key: string,
    ) {
      super(key);
    }

    public extract(data: any): ExtractionResult<T> {
      if (typeof data !== 'object' || data === null) {
        return {
          data: undefined,
          path: this.key,
        };
      }
      return {
        data: this.transformBeforeExtract(
          DeepExtractor.getObjectByPath(data, this.key.split('.')),
        ),
        path: this.key,
      };
    }

    public apply(applyObject: any, value: T): void {
      const keys = this.key.split('.');
      const dataObject = DeepExtractor.getOrCreateObjectByPath(applyObject, keys.slice(0, -1));
      dataObject[keys[keys.length - 1]] = this.transformBeforeApply(value);
    }

  }

  class Person {

    @property()
    public id: number;

    @property(DeepExtractor.byPath('data.person.age').transform({
      onDeserialize: value => value && Number(value),
      onSerialize: value => value && String(value),
    }))
    public age: number;

    @property(DeepExtractor.byPath('data.person.last_name'))
    public lastName: string = 'Default';

    @property(DeepExtractor.byPath('data.person.first_name'))
    public firstName: string;

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

  console.log(person); // Person { lastName: "John", id: 123, age: 25, firstName: "Doe" }

  console.log(serialize(person)); // { id : 123, data: { person: {age: "25", last_name: "John", first_name: "Doe" } } }

})();

// Only deserializable property by extractor
(() => {

  console.log('Only deserializable property by extractor');

  class OnlyDeserializeStraightExtractor<T> extends StraightExtractor<T> {
    public apply(applyObject: any, value: T): void {
    }
  }

  class Department {
    @property(OnlyDeserializeStraightExtractor)
    public id: number;

    @property()
    public title: string;
  }

  const department = deserialize(Department, {
    id: 123,
    title: 'Department title',
  });
  console.log(department); // Department { id: 123, title: "Department title" }

  console.log(serialize(department)); // { title: "Department title" }

})();

// Only deserializable property by transformation
(() => {

  console.log('Only deserializable property by transformation');

  class Department {
    @property(StraightExtractor.transform({
      onSerialize: () => { },
    }))
    public id: number;

    @property()
    public title: string;
  }

  const department = deserialize(Department, {
    id: 123,
    title: 'Department title',
  });
  console.log(department); // Department { id: 123, title: "Department title" }

  console.log(serialize(department)); // { title: "Department title" }

})();

// Getters and setters
(() => {

  console.log('Getters and setters');

  class PersonWithGetter {
    constructor(
      public firstName: string,
      public lastName: string,
    ) {
    }

    @property()
    public get fullName(): string {
      return this.firstName + ' ' + this.lastName
    }
  }

  const personWithGetter = new PersonWithGetter('John', 'Doe');
  console.log(serialize(personWithGetter)); // { fullName: "John Doe" }

  class PersonWithSetter {
    public firstName: string;
    public lastName: string;

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

})();

// Syntactic sugar - SerializableObject class
(() => {

  console.log('Syntactic sugar - SerializableObject class');

  class Item extends SerializableObject {
    @property()
    public id: number;
    @property()
    public title: string;
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

})();

// Basic validation
(() => {

  console.log('Basic validation');

  class Person {
    @property()
    @propertyValidators([RequiredValidator, StringLengthValidator.with({ min: 1 })])
    public name: string;
  }

  const resultRequired = validate(Person, {});
  console.log(resultRequired); // [ ValidationError { message: "Property is required", path: "name" } ]

  const resultEmpty = validate(Person, {
    name: '',
  });
  console.log(resultEmpty); // [ ValidationError { message: "Property length should be greater than or equal 1", path: "name" } ]

})();

// Deep validation
(() => {

  console.log('Deep validation');

  class Address {
    @property()
    @propertyValidators([RequiredValidator])
    public city: string;
  }

  class Employee {
    @property()
    @propertyValidators([RequiredValidator])
    public name: string;

    @property()
    @propertyValidators([RequiredValidator])
    public address: Address;
  }

  class Department {
    @property(SnakeCaseExtractor)
    @propertyType(Employee)
    public departmentEmployees: Employee[];
  }

  const data = {
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
      {
        name: 'Jane Doe',
        address: {
        },
      },
      {
        name: 'Jane Smith',
        address: {
          city: 'Berlin'
        },
      },
    ],
  };

  const validationResult = validate(Department, data);

  console.log(validationResult); // [ ValidationError { message: 'Property is required', path: "department_employees.[1].name" }, ValidationError { message: "Property is required", path: "department_employees.[2].address.city" } ]

})();

// Custom validator
(() => {

  console.log('Custom validator');

  class VINValidator extends Validator {
    public validate(value: any, path: string): ValidationError | undefined {
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
    public vin: string;
  }

  const validationResult = validate(Vehicle, { vin: '345435' });

  console.log(validationResult); // [ ValidationError { message: "Invalid VIN", path: "vin" } ]


})();

// Custom validation error
(() => {

  console.log('Custom validation error');

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

    public validate(value: any, path: string): ValidationError | undefined {
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
    public password: string;
  }

  const shortPasswordResult = validate(LoginCredentials, { password: '123' });
  console.log(shortPasswordResult); // [ PasswordCriticalValidationError { message: "Password too short", path: "password" } ]

  const weakPasswordResult = validate(LoginCredentials, { password: '12345' });
  console.log(weakPasswordResult); // [ PasswordWarnValidationError { message: "Password is weak", path: "password" } ]

  const criticalErrors = weakPasswordResult.filter(error => !(error instanceof PasswordWarnValidationError));
  console.log(criticalErrors); // []

})();

// SerializableObjectWithValidation
(() => {

  console.log('Serializable object with validation');

  class Person extends SerializableObjectWithValidation {
    @property()
    @propertyValidators([RequiredValidator, StringLengthValidator.with({ min: 1 })])
    public name: string;
  }

  const resultRequired = Person.validate({});
  console.log(resultRequired); // [ ValidationError { message: "Property is required", path: "name" } ]

  const resultEmpty = validate(Person, {
    name: '',
  });
  console.log(resultEmpty); // [ ValidationError { message: "Property length should be greater than or equal 1", path: "name" } ]

})();
