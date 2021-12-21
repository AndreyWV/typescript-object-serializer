import { SerializableObjectWithoutBase } from '../serializable-object';
import { Constructor } from '../base-types/constructor';
import { RecursivePartial } from '../base-types/recursive-partial';
import {
  SERIALIZABLE_PROPERTIES_KEY,
  SERIALIZABLE_TYPES_KEY,
} from '../metadata-keys';
import { clone } from './clone';

export function create<T>(
  constructor: Constructor<T>,
  data: RecursivePartial<SerializableObjectWithoutBase<T>> = {},
): T {
  if (data instanceof constructor) {
    return clone(data) as T;
  }

  const instance = new constructor() as T;

  const keyTypes: Map<keyof T, any> = (constructor as any)[SERIALIZABLE_TYPES_KEY];

  (Object.keys(data) as Array<keyof T>)
    .forEach(
      key => {
        const keyType = keyTypes?.get(key) ||
          (
            (Reflect as any).getMetadata &&
            (Reflect as any).getMetadata('design:type', instance, key as string | symbol)
          );
        if (keyType?.[SERIALIZABLE_PROPERTIES_KEY]) {
          if (Array.isArray(data[key])) {
            instance[key] = (data[key] as Array<any>).map(item => create(keyType, item)) as any;
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
