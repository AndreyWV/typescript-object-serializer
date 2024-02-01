import { ExtractorsClassStore } from '../class-stores/extractor-store';
import { SerializableObject } from '../serializable-object';
import { deleteUndefinedRecursive } from '../utils/delete-undefined';

/**
 * @method serialize Serialize instance date
 * @param object Serializable object instance
 * @returns { any } Object of serialized data
 */
export function serialize<T extends Object>(object: T): any {
  const data = {};

  const keysStore = new ExtractorsClassStore((object as any).constructor).findStoreMap();

  if (!keysStore) {
    if (typeof object === 'object') {
      return data;
    }
    return object;
  }

  Array.from(keysStore.keys()).forEach(
    key => {
      const extractor = keysStore.get(key);
      const value = (object as any)[key];

      let serializedValue;
      if (Array.isArray(value)) {
        serializedValue = value.map(itm => serialize(itm));
      } else {
        serializedValue = isSerializableObject(value) ?
          serialize(value) :
          value;
      }

      extractor?.apply(data, serializedValue);
    },
  );

  return deleteUndefinedRecursive(data);
}

function isSerializableObject(value: any): value is Object {
  return value instanceof SerializableObject ||
    Boolean(
      new ExtractorsClassStore((value)?.constructor).findStoreMap(),
    );
}
