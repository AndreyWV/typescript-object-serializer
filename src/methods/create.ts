import { Constructor } from '../base-types/constructor';
import { RecursivePartial } from '../base-types/recursive-partial';
import { SerializableObjectWithoutBase } from '../serializable-object';
import {
  getSerializableProperties,
  getSerializablePropertiesTypes,
} from '../utils/get-serializable-properties';
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

  const keyTypes = getSerializablePropertiesTypes(ctor) as Map<keyof T, any>;

  (Object.keys(data) as Array<keyof T>)
    .forEach(
      key => {
        const keyType = keyTypes?.get(key) ||
          (
            (Reflect as any).getMetadata &&
            (Reflect as any).getMetadata('design:type', instance, key as string | symbol)
          );

        const isKeyHasSerializableProperties = Boolean(
          getSerializableProperties(keyType),
        );
        if (isKeyHasSerializableProperties) {
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
