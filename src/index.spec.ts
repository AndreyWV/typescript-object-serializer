import { SerializableObject } from './serializable-object';
import { ExtractorCamelCase } from './decorators/property/extractor-camel-case';
import { property } from './decorators/property/property';

class A extends SerializableObject {
  @property()
  ad: string;
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

test('test', () => {
  const c = C.create();
  c.camelCaseTest = '234234';
  const d = c.serialize();
  // console.log(d);
  C.deserialize({
    b: {
      a: {
        ad: '123'
      }
    }
  });
  expect(c.b.a).toBe('123');
})
