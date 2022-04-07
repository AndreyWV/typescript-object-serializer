import { Constructor } from '../base-types/constructor';
import { RecursivePartial } from '../base-types/recursive-partial';
import {
  SERIALIZABLE_PROPERTIES_KEY,
  SERIALIZABLE_TYPES_KEY,
} from '../metadata-keys';
import { SerializableObjectWithoutBase } from '../serializable-object';
import { clone } from './clone';

/**
 * @function create Create Serializable class instance
 * @param ctor Constructor of serializable class
 * @param data Plain object structured as current class
 * @returns Instance of serializable class constructor
 */
export function create<T>(
  ctor: Constructor<T>,
  data: RecursivePartial<SerializableObjectWithoutBase<T>> = {},
): T {
  if (data instanceof ctor) {
    return clone(data) as T;
  }

  const instance = new ctor() as T;

  const keyTypesKey = `${SERIALIZABLE_TYPES_KEY}_${ctor?.name}`;
  const keyTypes: Map<keyof T, any> = (ctor as any)[keyTypesKey];

  (Object.keys(data) as Array<keyof T>)
    .forEach(
      key => {
        const keyType = keyTypes?.get(key) ||
          (
            (Reflect as any).getMetadata &&
            (Reflect as any).getMetadata('design:type', instance, key as string | symbol)
          );

        const keyTypePropertiesKey = `${SERIALIZABLE_PROPERTIES_KEY}_${keyType?.name}`;
        if (keyType?.[keyTypePropertiesKey]) {
          if (Array.isArray(data[key])) {
            instance[key] = (data[key] as Array<any>).map(item => create(keyType, item)) as any;
          } else {
            instance[key] = create(keyType, data[key] as any);
          }
        } else {
          instance[key] = data[key] as any;
        }
      }
    )

  return instance;
}
