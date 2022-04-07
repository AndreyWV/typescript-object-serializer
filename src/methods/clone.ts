import { SERIALIZABLE_PROPERTIES_KEY } from '../metadata-keys';
import { create } from './create';

/**
 * @method clone Create same object as passed (including deep serializable instances)
 * @param data Serializable class instance
 * @returns New instance of passed object
 */
export function clone<T>(data: T): T {
  const ctor = (data as any).constructor;
  const instance = create(ctor) as T;

  const cloneValue = (value: any): any => {
    const valuePropertiesKey = `${SERIALIZABLE_PROPERTIES_KEY}_${value?.constructor?.name}`;
    if (Array.isArray(value)) {
      return value.map(v => cloneValue(v));
    } else if (value?.constructor[valuePropertiesKey]) {
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
