import { Constructor } from '../../utils/constructor';
import {
  RecursiveObject,
  RecursivePartial,
} from '../../utils/recursive-type';
import { ExtractorsClassStore } from '../store/extractor-store';
import { TypesClassStore } from '../store/types-store';
import { clone } from './clone';

/**
 * @function create Create Serializable class instance
 * @param ObjectConstructor Constructor of serializable class
 * @param data Plain object structured as current class
 * @returns Instance of serializable class constructor
 */
export function create<T>(
  ObjectConstructor: Constructor<T>,
  data: RecursiveObject<T>,
): T {
  if (data instanceof ObjectConstructor) {
    return clone(data);
  }

  return new ObjectCreator(ObjectConstructor).create(data);
}

/**
 * @function create Create Serializable class instance
 * !IMPORTANT This method get <RecursivePartial> values and set it as is
 *   Prefer to use create() method with strict type checking
 * @param ObjectConstructor Constructor of serializable class
 * @param data Plain object structured as current class
 * @returns Instance of serializable class constructor
 */
export function createPartial<T>(
  ObjectConstructor: Constructor<T>,
  data?: RecursivePartial<T>,
): T {
  return create(ObjectConstructor, (data ?? {}) as never);
}

class ObjectCreator<T> {

  private readonly instance: T;
  private readonly typesStore: TypesClassStore;

  constructor(
    private readonly ObjectConstructor: Constructor<T>,
  ) {
    this.instance = new this.ObjectConstructor();
    this.typesStore = new TypesClassStore(ObjectConstructor as Constructor<never>);
  }

  public create(data: RecursiveObject<T>): T {
    (Object.keys(data) as Array<keyof T>)
      .forEach(
        key => {
          const keyType = this.getKeyTypeFromInstance((data as T)[key])
            ?? this.getKeyType(key);

          const dataValue = (data as T)[key];

          if (ObjectCreator.isValueShouldApplyWithoutModify(keyType, dataValue)) {
            this.instance[key] = dataValue;
            return;
          }

          const isKeyHasSerializableProperties = Boolean(
            new ExtractorsClassStore(keyType as Constructor<never>)
              .findStoreMap(),
          );

          if (isKeyHasSerializableProperties) {
            if (Array.isArray(dataValue)) {
              this.instance[key] = dataValue
                .map(
                  item => new ObjectCreator(
                    this.getKeyTypeFromInstance(item) as Constructor<unknown>
                    ?? keyType as Constructor<unknown>,
                  )
                    .create(item),
                ) as never;
            } else {
              this.instance[key] = new ObjectCreator(keyType as Constructor<unknown>)
                .create(dataValue as RecursiveObject<never>) as never;
            }
          } else {
            // If by some reasons previous conditions are not met
            this.instance[key] = dataValue;
          }
        },
      );

    return this.instance;
  }

  static isValueShouldApplyWithoutModify(keyType: unknown, value: unknown): boolean {
    return value === undefined
      || value === null
      || typeof value !== 'object'
      || !keyType;
  }

  private getKeyType(key: keyof T): unknown {
    const keysMap = this.typesStore.findStoreMap()?.get(key);

    return keysMap
      ? Array.from(keysMap.keys())[0]
      : Reflect?.getMetadata?.('design:type', this.instance as object, key as string | symbol);
  }

  private getKeyTypeFromInstance(data: unknown): unknown {
    if (typeof data !== 'object' || data === null) {
      return null;
    }
    const dataConstructor = data.constructor;
    if (!dataConstructor) {
      return null;
    }

    const classExtractors = new ExtractorsClassStore(dataConstructor as Constructor<never>)
      .findStoreMap();

    // Check if object is extends class declared in parent declaration
    return classExtractors
      ? dataConstructor
      : null;
  }

}
