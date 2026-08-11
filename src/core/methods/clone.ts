import { Constructor } from '../../utils/constructor';
import { ExtractorsClassStore } from '../store/extractor-store';
import { createPartial } from './create';

/**
 * @method clone Create same object as passed (including deep serializable instances)
 * @param data Serializable class instance
 * @returns New instance of passed object
 */
export function clone<T extends object>(data: T): T {

  return new ObjectCloner(data)
    .clone();

}

class ObjectCloner<T extends object> {

  private readonly instance: T;

  constructor(
    private readonly data: T,
  ) {

    const dataConstructor = (data as { constructor: new (...args: never[]) => T; })
      .constructor as Constructor<T>;
    this.instance = createPartial(dataConstructor) as T;

  }

  public clone(): T {

    (Object.keys(this.data) as Array<keyof T>)
      .forEach(
        key => this.instance[key] = ObjectCloner.cloneValue(this.data[key]),
      );

    return this.instance;

  }

  private static cloneValue<U>(value: U): U {

    const isValueHasSerializableProperties = new ExtractorsClassStore(
      (value as { constructor: new (...args: never[]) => never; })
        ?.constructor as Constructor<never>,
    )
      .findStoreMap() !== undefined;
    if (Array.isArray(value)) {

      return value
        .map(
          item => {

            const isItemHasSerializableProperties = new ExtractorsClassStore(
              (item as { constructor: new (...args: never[]) => never; })
                ?.constructor as Constructor<never>,
            )
              .findStoreMap() !== undefined;

            if (!isItemHasSerializableProperties) {

              return item;

            }

            return new ObjectCloner(item)
              .clone();

          },
        ) as U;

    } else if (isValueHasSerializableProperties) {

      return new ObjectCloner(value as never)
        .clone();

    }
    return value;

  };

}
