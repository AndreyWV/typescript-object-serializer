import 'reflect-metadata';
import { property } from '../src/decorators/property/property';
import { SerializableObject } from '../src/serializable-object';

class DeepNestedProperty extends SerializableObject {
  @property()
  public test: number = 0;
}

class NestedProperty extends SerializableObject {
  @property()
  public deepNestedProperty: DeepNestedProperty;
}

class Test extends SerializableObject {
  @property()
  public nestedProperty: NestedProperty;
}

const instance = Test.create({
  nestedProperty: {
    deepNestedProperty: {
      test: 78,
    },
  },
});

console.log(instance);
