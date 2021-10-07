import 'reflect-metadata';
import { SerializableObject } from '../src/serializable-object';
import { propertyType } from '../src/decorators/property-type/type';
import { ExtractorCamelCase } from '../src/decorators/property/extractor-camel-case';
import { property } from '../src/decorators/property/property';

// export function property1(): PropertyDecorator {
//   return (target: any, propertyKey: string | symbol) => {
//     console.log(Reflect.getMetadata('design:type', target, propertyKey));
//   }
// }

// export class Test {
//   @property1()
//   a: number;
// }

// class A extends SerializableObject {
//   @property()
//   aaa: string;
// }

// class B extends SerializableObject {
//   @property()
//   a: A;
// }

// class C extends SerializableObject {
//   @property()
//   b: B;

//   @property(ExtractorCamelCase)
//   camelCaseTest: string;
// }

// const c = C.create();
// c.b = {
//   a: {
//     b: '234234',
//   },
// } as any;
// c.camelCaseTest = '234234';
// const cDeserialized = C.create({
//   b: {
//   },
//   camelCaseTest: '123123',
// });
// console.log(cDeserialized)
// console.log(cDeserialized.b instanceof B);
// console.log(cDeserialized.b.a === undefined);

// class SuccessExample extends SerializableObject {

// }

// class ErrorExample extends SerializableObject {

// }

// class TestSuccessError extends SerializableObject {

//   @property()
//   @propertyType((data: any) => data?.success ? SuccessExample : ErrorExample)
//   success: SuccessExample | ErrorExample;

//   @property()
//   @propertyType((data: any) => data?.success ? SuccessExample : ErrorExample)
//   error: SuccessExample | ErrorExample;

// }

// const test = TestSuccessError.deserialize({
//   success: {
//     success: true,
//   },
//   error: {
//     success: false,
//   },
// });

// console.log(test.success instanceof SuccessExample);
// console.log(test.error instanceof ErrorExample);

class A extends SerializableObject {

  @property()
  data: string;

}


class Data extends SerializableObject {

  @property()
  @propertyType(A)
  data: A[];

  @property()
  testString: string = '123213131';

}

// const data = Data.create({
//   data: [
//     {
//       data: 'asd'
//     }
//   ]
// });

// console.log(data.data[0] instanceof A);

const deserialized = Data.deserialize({
  data: [
    {
      data: 'asd',
    },
    {
      data: 'asd1',
    }
  ]
})
console.log(deserialized);
console.log(deserialized.data[0] instanceof A);

const clone = deserialized.clone();
console.log(clone.data[0] instanceof A);
console.log(clone.data[0] === deserialized.data[0]);
console.log(clone.serialize());

const testInstance = Data.create();
console.log(testInstance);
