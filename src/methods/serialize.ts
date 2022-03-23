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

        let serializedValue;
        if (Array.isArray(value)) {
          serializedValue = value.map(itm => serialize(itm));
        } else {
          const isSerializableObject = value instanceof SerializableObject || (value as any)?.constructor?.[SERIALIZABLE_PROPERTIES_KEY];
          serializedValue = isSerializableObject ?
            serialize(value) :
            value;
        }

        extractor?.apply(data, serializedValue);
      },
    );
  }


  return data;
}
