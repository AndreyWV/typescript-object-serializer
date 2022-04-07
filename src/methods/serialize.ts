import { Extractor } from '../decorators/property/base-extractor';
import { SerializableObject } from '../serializable-object';
import { deleteUndefinedRecursive } from '../utils/delete-undefined';
import { getSerializableProperties } from '../utils/get-serializable-properties';

/**
 * @method serialize Serialize instance date
 * @param object Serializable object instance
 * @returns { any } Object of serialized data
 */
export function serialize<T extends Object>(object: T): any {
  const data = {};

  const keys = getSerializableProperties((object as any).constructor) as Map<keyof T, Extractor>;
  if (keys) {
    Array.from(keys.keys()).forEach(
      key => {
        const extractor = keys.get(key);
        const value = object[key];

        let serializedValue;
        if (Array.isArray(value)) {
          serializedValue = value.map(itm => serialize(itm));
        } else {
          const isSerializableObject = value instanceof SerializableObject ||
            Boolean(getSerializableProperties((value as any)?.constructor))
          serializedValue = isSerializableObject ?
            serialize(value) :
            value;
        }

        extractor?.apply(data, serializedValue);
      },
    );
  }

  return deleteUndefinedRecursive(data);
}
