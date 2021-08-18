import 'reflect-metadata';
import { Extractor } from './decorators/property/extractor.base';
import { SERIALIZABLE_PROPERTIES_KEY, SERIALIZABLE_TYPES_KEY } from './metadata-keys';

type RecursivePartial<T> = {
  [K in keyof T]?: RecursivePartial<T[K]>;
}

type RecursiveWithoutBase<T> = {
  [K in keyof T]: T[K] extends SerializableObject ?
  SerializableObjectWithoutBase<T[K]> :
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

    (Object.keys(data) as Array<keyof InstanceType<T>>).forEach(
      key => {
        const keyType = keyTypes?.get(key) ||
          Reflect.getMetadata('design:type', instance, key as string | symbol);
        if (keyType?.prototype instanceof SerializableObject) {
          instance[key] = keyType.create(data[key]);
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

    const keys: Map<keyof InstanceType<T>, Extractor> = Reflect.getMetadata(SERIALIZABLE_PROPERTIES_KEY, instance);

    if (keys) {
      Array.from(keys.keys()).forEach(
        key => {
          const keyTypes: Map<keyof InstanceType<T>, any> = Reflect.getMetadata(SERIALIZABLE_TYPES_KEY, instance);
          const keyType = keyTypes?.get(key) ||
            Reflect.getMetadata('design:type', instance, key as string | symbol);

          const extractor: Extractor | undefined = keys.get(key);

          if (keyType?.prototype instanceof SerializableObject) {
            const objectData = extractor?.extract(data);
            instance[key] = objectData && keyType.deserialize(objectData);
            return;
          } else if (typeof keyType === 'function') {
            const objectData = extractor?.extract(data);
            const customKeyType = keyType(objectData);
            if (customKeyType?.prototype instanceof SerializableObject) {
              instance[key] = objectData && customKeyType.deserialize(objectData);
              return;
            }
          }

          instance[key] = extractor?.extract(data);
        }
      )
    }

    return instance;
  }


  public static deserializeArray<T extends typeof SerializableObject>(
    this: T,
    data: any[],
  ): InstanceType<T>[] {
    if (!Array.isArray(data)) {
      return [];
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
        extractor?.apply(data, serializedValue);
      },
    );

    return data;
  }

  public clone(): this {
    return this;
  }
}


