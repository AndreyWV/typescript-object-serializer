import { Constructor } from '../base-types/constructor';
import { Extractor } from '../decorators/property/base-extractor';
import { getPropertyDescriptor } from '../utils/get-property-descriptor';
import {
  getSerializableProperties,
  getSerializablePropertiesTypes,
} from '../utils/get-serializable-properties';

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

  const props = getSerializableProperties(ctor);

  if (!props) {
    return instance;
  }

  const keyTypes = getSerializablePropertiesTypes(ctor);

  Array.from(props.keys()).forEach(
    key => {
      const keyTypeFunctionOrConstructor = keyTypes?.get(key) ||
        (
          (Reflect as any).getMetadata &&
          (Reflect as any).getMetadata('design:type', instance, key as string | symbol)
        );

      const extractor: Extractor | undefined = props.get(key);

      const objectData = extractor?.extract(data);

      if (!objectData) {
        /* If objectData === undefined than instance[key] should have default value from class description */
        if (objectData !== undefined) {
          /* null / 0 / '' / false */
          applyValue(instance, key, objectData);
        }

        return;
      }

      const isConstructor = (isConstructorSomething: any): boolean => {
        if (typeof isConstructorSomething !== 'function') {
          return false;
        }
        try {
          isConstructorSomething();
          return false;
        } catch {
          return true;
        }
      }

      if (Array.isArray(objectData)) {
        if (isConstructor(keyTypeFunctionOrConstructor)) {
          applyValue(
            instance,
            key,
            objectData.map(item => deserialize(keyTypeFunctionOrConstructor, item)) as any,
          );
        } else if (typeof keyTypeFunctionOrConstructor === 'function') {
          applyValue(
            instance,
            key,
            objectData.map(item => {
              const itemType = keyTypeFunctionOrConstructor(item);
              if (itemType !== undefined) {
                return deserialize(itemType, item);
              }
              return item;
            }) as any,
          );
        } else {
          applyValue(instance, key, objectData);
        }
        return;
      }

      const getKeyTypeFromFunction = () => {
        try {
          return keyTypeFunctionOrConstructor(objectData);
        } catch {
        }
      }

      const keyType = isConstructor(keyTypeFunctionOrConstructor) ?
        keyTypeFunctionOrConstructor :
        getKeyTypeFromFunction();

      if (!keyType) {
        applyValue(instance, key, objectData);
        return;
      }

      const isKeyHasSerializableProperties = Boolean(
        getSerializableProperties(keyType),
      );

      if (isKeyHasSerializableProperties) {
        applyValue(instance, key, deserialize(keyType, objectData));
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
