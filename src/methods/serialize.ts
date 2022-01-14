import { Extractor } from '../decorators/property/base-extractor';
import { SERIALIZABLE_PROPERTIES_KEY } from '../metadata-keys';
import { SerializableObject } from '../serializable-object';

/**
 * @method serialize Serialize instance date
 * @param object Serializable object instance
 * @returns { any } Object of serialized data
 */
export function serialize<T extends Object>(object: T): any {
  const data = {};

  const keys: Map<keyof T, Extractor> = (object as any).constructor[SERIALIZABLE_PROPERTIES_KEY];
  if (keys) {
    Array.from(keys.keys()).forEach(
      key => {
        const extractor = keys.get(key);
        const value = object[key];
        const isSerializableObject = value instanceof SerializableObject || (value as any)?.[SERIALIZABLE_PROPERTIES_KEY];
        const serializedValue = isSerializableObject ?
          serialize(value) :
          value;
        if (serializedValue !== undefined) {
          extractor?.apply(data, serializedValue);
        }
      },
    );
  }


  return data;
}
