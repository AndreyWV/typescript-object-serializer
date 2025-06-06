import { ExtractorsClassStore } from '../store/extractor-store';
import { createPartial } from './create';

/**
 * @method clone Create same object as passed (including deep serializable instances)
 * @param data Serializable class instance
 * @returns New instance of passed object
 */
export function clone<T extends object>(data: T): T {
  return new ObjectCloner(data).clone();
}

class ObjectCloner<T extends object> {

  private readonly instance: T;

  constructor(
    private readonly data: T,
  ) {
    const DataConstructor = (data as any).constructor;
    this.instance = createPartial(DataConstructor) as T;
  }

  public clone(): T {
    (Object.keys(this.data) as Array<keyof T>)
      .forEach(
        key => this.instance[key] = ObjectCloner.cloneValue(this.data[key]),
      );

    return this.instance;
  }

  private static cloneValue<U>(value: U): U {
    const isValueHasSerializableProperties = Boolean(
      new ExtractorsClassStore((value as any)?.constructor)
        .findStoreMap(),
    );
    if (Array.isArray(value)) {
      return value
        .map(
          item => new ObjectCloner(item)
            .clone(),
        ) as U;
    } else if (isValueHasSerializableProperties) {
      return new ObjectCloner(value as any)
        .clone();
    }
    return value;
  };

}
