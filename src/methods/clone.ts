import { SERIALIZABLE_PROPERTIES_KEY } from '../metadata-keys';
import { create } from './create';

export function clone<T>(data: T): T {
  const instance = create((data as any).constructor) as T;

  const cloneValue = (value: any): any => {
    if (Array.isArray(value)) {
      return value.map(v => cloneValue(v));
    } else if (value?.constructor[SERIALIZABLE_PROPERTIES_KEY]) {
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