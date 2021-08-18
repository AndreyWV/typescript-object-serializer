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

class A extends SerializableObject {
  @property()
  aaa: string;
}

class B extends SerializableObject {
  @property()
  a: A;
}

class C extends SerializableObject {
  @property()
  b: B;

  @property(ExtractorCamelCase)
  camelCaseTest: string;
}

const c = C.create();
c.b = {
  a: {
    b: '234234',
  },
} as any;
c.camelCaseTest = '234234';
const cDeserialized = C.create({
  b: {
  },
  camelCaseTest: '123123',
});
console.log(cDeserialized)
console.log(cDeserialized.b instanceof B);
console.log(cDeserialized.b.a === undefined);

