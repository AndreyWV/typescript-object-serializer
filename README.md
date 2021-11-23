# typescript-object-serializer
Typescript library to convert javascript object to typescript class and vice versa

## Installation and configuration
```sh
npm install typescript-object-serializer
```

Required configure `tsconfig.json`:
```json
{
    "compilerOptions": {
        // ...
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        // ...
    }
}
```

## Usage
### Basic usage
```typescript
import {
  SerializableObject,
  property,
  ExtractorCamelCase,
} from 'typescript-object-serializer';

class Person extends SerializableObject {

  @property()
  public name: string;
  
  @property(ExtractorCamelCase)
  public lastName: string;
  
}

const person = Person.deserialize({
  name: 'John',
  last_name: 'Doe',
});
console.log(person instanceof Person); // true
console.log(person.name); // "John"
console.log(person.lastName); // "Doe"
console.log(person.serialize()) // { name: "John", last_name: "Doe" }
```

### Deep serializable property
```typescript
import {
  SerializableObject,
  property,
  ExtractorCamelCase,
} from 'typescript-object-serializer';

class Person extends SerializableObject {

  @property()
  public name: string;
  
  @property(ExtractorCamelCase)
  public lastName: string;
  
}

class Employee extends SerializableObject {

  @property()
  id: number;

  @property()
  public person: Person;

}

const employee = Employee.deserialize({
  id: 1,
  person: {
    name: 'John',
    last_name: 'Doe',
  },
});

console.log(employee.person); // Person { name: "John", lastName: "Doe" }
```

### Handle arrays of data
```typescript
import {
  SerializableObject,
  property,
  ExtractorCamelCase,
  propertyType,
} from 'typescript-object-serializer';

class Person extends SerializableObject {

  @property()
  public name: string;
  
  @property(ExtractorCamelCase)
  public lastName: string;
  
}

class Employee extends SerializableObject {

  @property()
  id: number;
  
  @property()
  public person: Person;
  
}

class Department extends SerializableObject {

  @property()
  public title: string;
  
  @property()
  @propertyType(Employee)
  public employees: Employee[];
  
}

const employees = Employee.deserializeArray([
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
]);
console.log(employees.length); // 2
console.log(employees[0]); // Employee { id: 1, person: Person { name: "John", lastName: "Doe" } }

const department = Department.deserialize({
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
```

### Property extractor
#### ExtractorStraight [Default]
Extracts property with same name
```typescript
import {
  SerializableObject,
  property,
  ExtractorStraight,
} from 'typescript-object-serializer';

class Person extends SerializableObject {

  @property()
  public name: string;
  
  @property(ExtractorStraight) // Same as @property()
  public lastName: string;
  
}

const person = Person.deserialize({
  name: 'John',
  lastName: 'Doe',
});
console.log(person); // Person {name: "John", lastName: "Doe"}
```
#### ExtractorCamelCase
Extracts property by name transformed from `camelCase` to `snake_case`
```typescript
import {
  SerializableObject,
  property,
  ExtractorCamelCase,
} from 'typescript-object-serializer';

class Person extends SerializableObject {

  @property()
  public name: string;
  
  @property(ExtractorCamelCase)
  public lastName: string;
  
}

const person = Person.deserialize({
  name: 'John',
  last_name: 'Doe',
});
console.log(person); // Person {name: "John", lastName: "Doe"}
```

### Property type
Declares type for property. Required if not possible to detect type from property declaration (for example array of data) 
#### Property type basic
```typescript
import {
  SerializableObject,
  property,
  propertyType,
} from 'typescript-object-serializer';

class Person extends SerializableObject {

  @property()
  public name: string;

}

class Employee extends SerializableObject {

  @property()
  id: number;

  @property()
  @propertyType(Person) // <- Not required since possible to detect type from property declaration
  public person: Person;

}

class Department extends SerializableObject {

  @property()
  @propertyType(Employee) // <- Required because not possible to detect type from property declaration (property metadata seems like Array)
  public employees: Employee[];

}
```

#### Conditional property type
```typescript
import {
  SerializableObject,
  property,
  propertyType,
} from 'typescript-object-serializer';

class SuccessResult extends SerializableObject {
  @property()
  public data: any;
}
class FailedResult extends SerializableObject {
  @property()
  public error: string;
}

class Response extends SerializableObject {

  @property()
  @propertyType(value => value?.is_success ? SuccessResult : FailedResult)
  public results: Array<SuccessResult | FailedResult>;

}

const response = Response.deserialize({
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
  SerializableObject,
  property,
} from 'typescript-object-serializer';

class Person extends SerializableObject {

  @property()
  public lastName: string;

  @property()
  public firstName: string;

}

const person = Person.create();
console.log(person); // Person { }

const personWithData = Person.create({
  firstName: 'John',
  lastName: 'Doe',
});
console.log(personWithData); // Person { firstName: "John", lastName: "Doe" }
```

### Clone serializable object
```typescript
import {
  SerializableObject,
  property,
} from 'typescript-object-serializer';

class Person extends SerializableObject {

  @property()
  public lastName: string;

  @property()
  public firstName: string;

}

const person = Person.create({
  firstName: 'John',
  lastName: 'Doe',
});

const personClone = person.clone();

console.log(personClone); // Person { firstName: "John", lastName: "Doe" }
console.log(person === personClone); // false
```

### Serialize serializable object
Serialize object and all nested serializable objects to simple javascript object
```typescript
import {
  SerializableObject,
  property,
  ExtractorCamelCase,
} from 'typescript-object-serializer';

class Person extends SerializableObject {

  @property(ExtractorCamelCase)
  public lastName: string;

  @property(ExtractorCamelCase)
  public firstName: string;

}

const person = Person.create({
  firstName: 'John',
  lastName: 'Doe',
});

console.log(person.serialize()); // { first_name: "John", last_name: "Doe" }
```

### Transform property value
In case
1. Property value has wrong type (`string` or `null` when expected `number`)
```typescript
import {
  SerializableObject,
  property,
  ExtractorStraight,
} from 'typescript-object-serializer';

class Person extends SerializableObject {

  @property(ExtractorStraight.transform({
    onDeserialize: value => Number(value),
    onSerialize: value => String(value),
  }))
  public age: number;

}

const person = Person.deserialize({
  age: '25',
});

console.log(person); // Person { age: 25 }
console.log(typeof person.age); // number;
console.log(person.serialize()); // { age: "25" }
```
2. Need transform value to non-serializable and non-basic type
```typescript
import {
  SerializableObject,
  property,
  ExtractorStraight,
} from 'typescript-object-serializer';

class DepartmentId {

  constructor(
    public value: string,
  ) {
  }

  // Some DepartmentId logic

}

class Department extends SerializableObject {

  @property(ExtractorStraight.transform({
    onDeserialize: value => new DepartmentId(value),
    onSerialize: (value: DepartmentId) => value?.value,
  }))
  public id: DepartmentId;  // <- Non-serializable object type

}

const department = Department.deserialize({
  id: '1',
});

console.log(department); // Department { id: DepartmentId { value: "1" } }
console.log(department.serialize()); // { id: "1" }
```
