import { Constructor } from '../base-types/constructor';
import { ExtractorsClassStore } from '../class-stores/extractor-store';
import { TypesClassStore } from '../class-stores/types-store';
import { Extractor } from '../decorators/base-extractor';
import { getPropertyDescriptor } from '../utils/get-property-descriptor';
import { KeyType } from '../utils/key-type';

/**
 * @method deserialize Deserialize object to class
 * @param ctor { Constructor<T> } Constructor of serializable class
 * @param data { any } Object of serialized data
 * @returns Instance of serializable class constructor
 */
export function deserialize<T>(ctor: Constructor<T>, data: any): T {
  let instance: T;
  try {
    instance = new ctor();
  } catch {
    return data;
  }

  const props = new ExtractorsClassStore(ctor).findStoreMap();

  if (!props) {
    return instance;
  }

  const keyTypesStore = new TypesClassStore(ctor);

  Array.from(props.keys()).forEach(
    key => {

      const keyType = new KeyType(keyTypesStore, instance, key);
      const extractor: Extractor | undefined = props.get(key);
      const objectData = extractor?.extract(data)?.data;

      if (!objectData) {
        /* If objectData === undefined than instance[key] should have default value from class description */
        if (objectData !== undefined) {
          /* null / 0 / '' / false */
          applyValue(instance, key, objectData);
        }

        return;
      }

      if (Array.isArray(objectData)) {
        applyValue(
          instance,
          key,
          objectData.map(item => {
            const itemTypeConstructor = keyType.getConstructorForObject(item);
            return itemTypeConstructor ?
              deserialize(itemTypeConstructor, item) :
              item;
          }),
        );
        return;
      }

      const keyTypeConstructor = keyType.getConstructorForObject(objectData);

      if (!keyTypeConstructor) {
        applyValue(instance, key, objectData);
        return;
      }

      const isKeyHasSerializableProperties = Boolean(
        new ExtractorsClassStore(keyTypeConstructor).findStoreMap(),
      );

      if (isKeyHasSerializableProperties) {
        applyValue(instance, key, deserialize(keyTypeConstructor, objectData));
      } else {
        applyValue(instance, key, objectData);
      }

    }
  );

  return instance;
}

function applyValue(instance: any, key: string | number | symbol, value: any): void {
  const descriptor = getPropertyDescriptor(instance, key);
  if (!descriptor || descriptor.writable || descriptor.set) {
    instance[key] = value;
  }
}
