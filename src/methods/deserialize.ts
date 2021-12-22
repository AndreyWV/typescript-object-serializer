import { SerializableObject } from '..';
import { Constructor } from '../base-types/constructor';
import { Extractor } from '../decorators/property/base-extractor';
import {
  SERIALIZABLE_PROPERTIES_KEY,
  SERIALIZABLE_TYPES_KEY,
} from '../metadata-keys';

export function deserialize<T>(constructor: Constructor<T>, data: any): T {
  const instance = new constructor();

  const props: Map<keyof T, Extractor> = (constructor as any)[SERIALIZABLE_PROPERTIES_KEY];

  if (!props) {
    return instance;
  }

  Array.from(props.keys()).forEach(
    key => {
      const keyTypes: Map<keyof T, any> = (constructor as any)[SERIALIZABLE_TYPES_KEY];
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
          instance[key] = objectData;
        }

        return;
      }

      if (Array.isArray(objectData)) {
        const isSerializableObject = keyTypeFunctionOrConstructor?.prototype instanceof SerializableObject ||
          keyTypeFunctionOrConstructor?.[SERIALIZABLE_PROPERTIES_KEY];
        if (isSerializableObject) {
          instance[key] = objectData.map(item => deserialize(keyTypeFunctionOrConstructor, item)) as any;
        } else if (typeof keyTypeFunctionOrConstructor === 'function') {
          instance[key] = objectData.map(item => {
            const itemType = keyTypeFunctionOrConstructor(item);
            const isSerializableItemType = itemType?.prototype instanceof SerializableObject ||
              itemType?.[SERIALIZABLE_PROPERTIES_KEY];
            if (!itemType || !(isSerializableItemType)) {
              return item;
            }
            return deserialize(itemType, item);
          }) as any;
        } else {
          instance[key] = objectData as any;
        }
        return;
      }

      const getKeyTypeFromFunction = () => {
        try {
          const typeFromFunction = keyTypeFunctionOrConstructor(objectData);
          const isSerializableObject = typeFromFunction?.prototype instanceof SerializableObject ||
            typeFromFunction?.[SERIALIZABLE_PROPERTIES_KEY];
          if (isSerializableObject) {
            return typeFromFunction;
          }
        } catch {
        }
      }

      const isSerializableKeyType = keyTypeFunctionOrConstructor?.prototype instanceof SerializableObject ||
        keyTypeFunctionOrConstructor?.[SERIALIZABLE_PROPERTIES_KEY];

      const keyType = isSerializableKeyType ?
        keyTypeFunctionOrConstructor :
        getKeyTypeFromFunction();

      if (!keyType) {
        instance[key] = extractor?.extract(data);
        return;
      }

      instance[key] = deserialize(keyType, objectData);
    }
  );

  return instance;
}
