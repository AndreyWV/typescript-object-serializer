import 'reflect-metadata';
import { Extractor } from './decorators/property/extractor.base';
import {
  SERIALIZABLE_PROPERTIES_KEY,
  SERIALIZABLE_TYPES_KEY,
} from './metadata-keys';

type RecursivePartial<T> = {
  [K in keyof T]?: RecursivePartial<T[K]>;
}

type RecursiveWithoutBase<T> = {
  [K in keyof T]: T[K] extends SerializableObject ?
  SerializableObjectWithoutBase<T[K]> :
  T[K] extends Array<SerializableObject> ?
  Array<SerializableObjectWithoutBase<T[K][number]>> :
  T[K];
};

export type SerializableObjectWithoutBase<T extends Partial<SerializableObject>> =
  RecursiveWithoutBase<Pick<T, Exclude<keyof T, keyof SerializableObject>>>;

type SerializableObjectData<T extends typeof SerializableObject, I = InstanceType<T>> =
  RecursivePartial<SerializableObjectWithoutBase<I>>;

export class SerializableObject {

  public static create<T extends typeof SerializableObject>(
    this: T,
    data: SerializableObjectData<T> = {},
  ): InstanceType<T> {
    if (data instanceof this) {
      return data.clone() as InstanceType<T>;
    }

    const instance = new this() as InstanceType<T>;

    const keyTypes: Map<keyof InstanceType<T>, any> = Reflect.getMetadata(SERIALIZABLE_TYPES_KEY, instance);

    (Object.keys(data) as Array<keyof InstanceType<T>>)
      .forEach(
        key => {
          const keyType = keyTypes?.get(key) ||
            Reflect.getMetadata('design:type', instance, key as string | symbol);
          if (keyType?.prototype instanceof SerializableObject) {
            if (Array.isArray(data[key])) {
              instance[key] = (data[key] as Array<any>).map(item => keyType.create(item)) as any;
            } else {
              instance[key] = keyType.create(data[key]);
            }
          } else {
            instance[key] = data[key] as any;
          }
        }
      )

    return instance;

  }

  public static deserialize<T extends typeof SerializableObject>(
    this: T,
    data: any,
  ): InstanceType<T> {

    const instance = new this() as InstanceType<T>;

    const props: Map<keyof InstanceType<T>, Extractor> = Reflect.getMetadata(SERIALIZABLE_PROPERTIES_KEY, instance);

    if (!props) {
      return instance;
    }

    Array.from(props.keys()).forEach(
      key => {
        const keyTypes: Map<keyof InstanceType<T>, any> = Reflect.getMetadata(SERIALIZABLE_TYPES_KEY, instance);
        const keyTypeFunctionOrConstructor = keyTypes?.get(key) ||
          Reflect.getMetadata('design:type', instance, key as string | symbol);

        const extractor: Extractor | undefined = props.get(key);

        const objectData = extractor?.extract(data);

        if (!objectData) {
          /* If objectData === undefined than instance[key] should have default value from class description */
          if (objectData !== undefined) {
            /* null / 0 / '' / false */
            instance[key] = objectData;
          }

          return;
        }

        const keyType = keyTypeFunctionOrConstructor?.prototype instanceof SerializableObject ?
          keyTypeFunctionOrConstructor :
          typeof keyTypeFunctionOrConstructor === 'function' && keyTypeFunctionOrConstructor(objectData) instanceof SerializableObject ?
            keyTypeFunctionOrConstructor(objectData) :
            undefined;

        if (!keyType) {
          instance[key] = extractor?.extract(data);
          return;
        }

        if (Array.isArray(objectData)) {
          instance[key] = keyType.deserializeArray(objectData);
          return;
        }

        instance[key] = keyType.deserialize(objectData);
      }
    );

    return instance;

  }


  public static deserializeArray<T extends typeof SerializableObject>(
    this: T,
    data: any[],
  ): InstanceType<T>[] {
    if (!Array.isArray(data)) {
      throw new Error('Array data should be passed to deserializeArray method');
    }
    return data.map(data => this.deserialize(data));
  }

  public serialize(): any {
    const data = {};

    const keys: Map<keyof this, Extractor> = Reflect.getMetadata(SERIALIZABLE_PROPERTIES_KEY, this);
    Array.from(keys.keys()).forEach(
      key => {
        const extractor = keys.get(key);
        const value = this[key];
        const serializedValue = value instanceof SerializableObject ?
          value.serialize() :
          value;
        if (serializedValue !== undefined) {
          extractor?.apply(data, serializedValue);
        }
      },
    );

    return data;
  }

  public clone(): this {

    const instance = (this.constructor as typeof SerializableObject).create() as this;

    const cloneValue = (value: any): any => {
      if (Array.isArray(value)) {
        return value.map(v => cloneValue(v));
      } else if (value instanceof SerializableObject) {
        return value.clone();
      }
      return value;
    }

    const self = this;

    (Object.keys(self) as Array<keyof this>)
      .forEach(
        key => instance[key] = cloneValue(self[key]),
      );

    return instance as this;

  }
}


