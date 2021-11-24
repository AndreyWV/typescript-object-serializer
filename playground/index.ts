import { propertyType } from '../src/decorators/property-type/type';
import { SnakeCaseExtractor } from '../src/decorators/property/snake-case-extractor';
import { StraightExtractor } from '../src/decorators/property/straight-extractor';
import { property } from '../src/decorators/property/property';
import { SerializableObject } from '../src/serializable-object';
import { Extractor } from '../src/decorators/property/base-extractor';
import { Constructor } from '../src/base-types/constructor';
import { OverrideNameExtractor } from '../src/decorators/property/override-name-extractor';

// Basic usage
(() => {
  class Person extends SerializableObject {

    @property()
    public name: string;

    @property(SnakeCaseExtractor)
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
})();

// Deep serializable property
(() => {
  class Person extends SerializableObject {

    @property()
    public name: string;

    @property(SnakeCaseExtractor)
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
})();

// Handle arrays of data
(() => {
  class Person extends SerializableObject {

    @property()
    public name: string;

    @property(SnakeCaseExtractor)
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
})();

// StraightExtractor [Default]
(() => {
  class Person extends SerializableObject {

    @property()
    public name: string;

    @property(StraightExtractor) // Same as @property()
    public lastName: string;

  }

  const person = Person.deserialize({
    name: 'John',
    lastName: 'Doe',
  });

  console.log(person); // Person { name: "John", lastName: "Doe" }
})();

// SnakeCaseExtractor
(() => {
  class Person extends SerializableObject {

    @property()
    public name: string;

    @property(SnakeCaseExtractor)
    public lastName: string;

  }

  const person = Person.deserialize({
    name: 'John',
    last_name: 'Doe',
  });

  console.log(person); // Person { name: "John", lastName: "Doe" }
})();

// OverrideNameExtractor
(() => {
  class Department extends SerializableObject {

    @property(OverrideNameExtractor.use('department_id'))
    public id: string;

  }

  const department = Department.deserialize({
    department_id: '123',
  });

  console.log(department); // Department { id: "123" }
})();

// Property type basic
(() => {
  class Person extends SerializableObject {

    @property()
    public name: string;

    @property(SnakeCaseExtractor)
    public lastName: string;

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
})();

// Conditional property type
(() => {
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
})();

// Create serializable object
(() => {

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

})();

// Clone serializable object
(() => {
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
})();

// Serialize serializable object
(() => {
  class Person extends SerializableObject {

    @property(SnakeCaseExtractor)
    public lastName: string;

    @property(SnakeCaseExtractor)
    public firstName: string;

  }

  const person = Person.create({
    firstName: 'John',
    lastName: 'Doe',
  });

  console.log(person.serialize()); // { first_name: "John", last_name: "Doe" }
})();

// Transform property value (wrong type)
(() => {
  class Person extends SerializableObject {

    @property(StraightExtractor.transform({
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
})();

// Transform property value (class or any other type)
(() => {

  class DepartmentId {

    constructor(
      public value: string,
    ) {
    }

    // Some DepartmentId logic

  }

  class Department extends SerializableObject {

    @property(StraightExtractor.transform({
      onDeserialize: value => new DepartmentId(value),
      onSerialize: (value: DepartmentId) => value?.value,
    }))
    public id: DepartmentId; // <- Non-serializable object type

  }

  const department = Department.deserialize({
    id: '1',
  });

  console.log(department); // Department { id: DepartmentId { value: "1" } }
  console.log(department.serialize()); // { id: "1" }
})();

// Custom extractor
(() => {

  /* Extract value from `snake_case` property to "private" `camelCase` property  */
  class PrivateSnakeCaseExtractor<T> extends SnakeCaseExtractor<T> {
    constructor(
      key: string,
    ) {
      super(key.replace(/^_/, ''));
    }
  }

  class Department extends SerializableObject {

    @property(PrivateSnakeCaseExtractor)
    private _departmentId: string;

  }

  const department = Department.deserialize({
    department_id: '123',
  });

  console.log(department); // Department { _departmentId: "123" }

  /* Extract value from deep object */
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

    public extract(data: any): T | undefined {
      if (typeof data !== 'object' || data === null) {
        return undefined;
      }
      return this.transformBeforeExtract(
        DeepExtractor.getObjectByPath(data, this.key.split('.')),
      );
    }

    public apply(applyObject: any, value: T): void {
      const keys = this.key.split('.');
      const dataObject = DeepExtractor.getOrCreateObjectByPath(applyObject, keys.slice(0, -1));
      dataObject[keys[keys.length - 1]] = this.transformBeforeApply(value);
    }

  }

  class Person extends SerializableObject {

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

  const person = Person.deserialize({
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

  console.log(person.serialize()); // { id : 123, data: { person: {age: "25", last_name: "John", first_name: "Doe" } } }

})();
