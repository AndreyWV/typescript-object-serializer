import { Extractor } from '../decorators/property/base-extractor';
import { SERIALIZABLE_PROPERTIES_KEY } from '../metadata-keys';
import { SerializableObject } from '../serializable-object';
import { deleteUndefinedRecursive } from '../utils/delete-undefined';

/**
 * @method serialize Serialize instance date
 * @param object Serializable object instance
 * @returns { any } Object of serialized data
 */
export function serialize<T extends Object>(object: T): any {
  const data = {};

  const propertiesKey = `${SERIALIZABLE_PROPERTIES_KEY}_${(object as any).constructor.name}`;

  const keys: Map<keyof T, Extractor> = (object as any).constructor[propertiesKey];
  if (keys) {
    Array.from(keys.keys()).forEach(
      key => {
        const extractor = keys.get(key);
        const value = object[key];

        let serializedValue;
        if (Array.isArray(value)) {
          serializedValue = value.map(itm => serialize(itm));
        } else {
          const valuePropertiesKey = `${SERIALIZABLE_PROPERTIES_KEY}_${(value as any)?.constructor?.name}`;
          const isSerializableObject = value instanceof SerializableObject || (value as any)?.constructor?.[valuePropertiesKey];
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
