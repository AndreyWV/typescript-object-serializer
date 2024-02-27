import { ExtractorsClassStore } from '../class-stores/extractor-store';
import { create } from './create';

/**
 * @method clone Create same object as passed (including deep serializable instances)
 * @param data Serializable class instance
 * @returns New instance of passed object
 */
export function clone<T extends object>(data: T): T {
  const ctor = (data as any).constructor;
  const instance = create(ctor) as T;

  const cloneValue = (value: any): any => {
    const isValueHasSerializableProperties = Boolean(
      new ExtractorsClassStore(value?.constructor).findStoreMap(),
    );
    if (Array.isArray(value)) {
      return value.map(v => cloneValue(v));
    } else if (isValueHasSerializableProperties) {
      return clone(value);
    }
    return value;
  }

  (Object.keys(data) as Array<keyof T>)
    .forEach(
      key => instance[key] = cloneValue(data[key]),
    );

  return instance;
}
