# typescript-object-serializer
Typescript library to convert javascript object to typescript class and vice versa

[CHANGELOG](CHANGELOG.md)

## Installation and configuration
```sh
npm install typescript-object-serializer
```
Required configure `tsconfig.json`:
```json
{
    "compilerOptions": {
        "experimentalDecorators": true
    }
}
```
And it is ready to use!
**If necessary enable auto-detection types of serializable properties:** - required additional configuration:
1. Install `reflect-metadata` dependency:
```sh
npm install reflect-metadata
```
2. Configure `tsconfig.json`:
```json
{
    "compilerOptions": {
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
    }
}
```
3. Import `reflect-metadata` in `polyfills.ts` or in top of `index.ts` file
```typescript
import 'reflect-metadata';
```

## Usage
### Basic usage
```typescript
import {
  deserialize,
  serialize,
  property,
  SnakeCaseExtractor,
} from 'typescript-object-serializer';

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
```

### Deep serializable property
```typescript
import {
  deserialize,
  property,
  SnakeCaseExtractor,
} from 'typescript-object-serializer';

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
```

### Extend serializable class
```typescript
import {
  deserialize,
  property,
} from 'typescript-object-serializer';

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
```

### Auto-detect property types
```typescript
import {
  deserialize,
  property,
} from 'typescript-object-serializer';

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
```

### Handle arrays of data
```typescript
import {
  deserialize,
  property,
  SnakeCaseExtractor,
  propertyType,
} from 'typescript-object-serializer';

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
console.log('serialized department', serialize(department)); // {title: "Department title", employees: [ { id: 1, person: { name: "John", last_name: "Doe" } }, { id: 2, person: { name: "Jane", last_name: "Doe" } } ] }
```

### Property extractor
#### StraightExtractor [Default]
Extracts property with same name
```typescript
import {
  deserialize,
  property,
  StraightExtractor,
} from 'typescript-object-serializer';

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

console.log(person); // Person { name: "John", lastName: "Doe" }
```
#### SnakeCaseExtractor
Extracts property by name transformed from `camelCase` to `snake_case`
```typescript
import {
  deserialize,
  property,
  SnakeCaseExtractor,
} from 'typescript-object-serializer';

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

console.log(person); // Person { name: "John", lastName: "Doe" }
```
#### OverrideNameExtractor
Extracts property by name passed to `use` static method
```typescript
import {
  deserialize,
  property,
  OverrideNameExtractor,
} from 'typescript-object-serializer';

class Department {

  @property(OverrideNameExtractor.use('department_id'))
  public id: string;

}

const department = deserialize(Department, {
  department_id: '123',
});

console.log(department); // Department { id: "123" }
```

### Property type
Declares type for property. Required if not possible to detect type from property declaration (for example array of data) 
#### Property type basic
```typescript
import {
  property,
  propertyType,
} from 'typescript-object-serializer';

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
```

#### Conditional property type
```typescript
import {
  deserialize,
  property,
  propertyType,
} from 'typescript-object-serializer';

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
```

### Create serializable object
```typescript
import {
  create,
  property,
} from 'typescript-object-serializer';

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
```

### Clone serializable object
```typescript
import {
  create,
  clone,
  property,
} from 'typescript-object-serializer';

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
```

### Serialize serializable object
Serialize object and all nested serializable objects to simple javascript object
```typescript
import {
  create,
  serialize,
  property,
  SnakeCaseExtractor,
} from 'typescript-object-serializer';

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
```

### Transform property value
In case
1. Property value has type mismatch (`string` or `null` when expected `number`)
```typescript
import {
  deserialize,
  serialize,
  property,
  StraightExtractor,
} from 'typescript-object-serializer';

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
```
2. Need transform value to non-serializable and non-basic type
```typescript
import {
  serialize,
  deserialize,
  property,
  StraightExtractor,
} from 'typescript-object-serializer';

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
```

## Advanced usage
### Custom extractor
It is possible to develop your own extractor according to your needs
**Example 1**: `PrivateSnakeCaseExtractor`. Extracts `snake_case` property to `camelCase` property with leading `_`
```typescript
import {
  deserialize,
  property,
  SnakeCaseExtractor,
} from 'typescript-object-serializer';

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
```
**Example 2**: `DeepExtractor`. Extracts value from deep object
```typescript
import {
  deserialize,
  serialize,
  property,
  Extractor,
  ExtractionResult,
} from 'typescript-object-serializer';

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
```

### Only deserializable property
**Example 1**: Using custom extractor
```typescript
import {
  deserialize,
  serialize,
  property,
  StraightExtractor,
} from 'typescript-object-serializer';

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
```
**Example 2**: Using custom transformation
```typescript
import {
  deserialize,
  serialize,
  property,
  StraightExtractor,
} from 'typescript-object-serializer';

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
```

### Getters and setters
It is possible to serialize getter and deserialize setter property
```typescript
import {
  deserialize,
  serialize,
  property,
} from 'typescript-object-serializer';

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
```

# Syntactic sugar: `SerializableObject`
Class `SerializebleObject` for easy access to serializer methods like `serialize`, `deserialize`, `create`, `clone`, `deserializeArray`. it makes possible to import `'typescript-object-serializer'` only at class declaration file but not to import it where serialization/deserialization used.
```typescript
import {
  SerializableObject,
  property,
} from 'typescript-object-serializer';

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
```

# Data validation
It is possible to validate data before deserialization. Method `validate` from module `typescript-object-serializer/validators` returns Array of validation errors. It returns *empty array* if data is valid.

## Basic validation
```typescript
import { property } from 'typescript-object-serializer';
import {
  propertyValidators,
  RequiredValidator,
  StringLengthValidator,
  validate,
} from 'typescript-object-serializer/validators';

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
```

## Deep validation
```typescript
import {
  property,
  propertyType,
  SnakeCaseExtractor,
} from 'typescript-object-serializer';
import {
  propertyValidators,
  RequiredValidator,
  validate,
} from 'typescript-object-serializer/validators';

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
```

## Custom validator
```typescript
import { property } from 'typescript-object-serializer';
import {
  propertyValidators,
  validate,
  ValidationError,
  Validator,
} from 'typescript-object-serializer/validators';

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
```

## Custom validation error
It is possible to implement own validation errors at custom validators. It allows to
1. Add some logic on validation result: filter critical and non-critical errors
2. Add error class with predefined message (no need to write error message at `validate()` method)
```typescript
import { property } from 'typescript-object-serializer';
import {
  propertyValidators,
  validate,
  ValidationError,
  Validator,
} from 'typescript-object-serializer/validators';

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
```
