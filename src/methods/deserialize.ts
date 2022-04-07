import { Constructor } from '../base-types/constructor';
import { Extractor } from '../decorators/property/base-extractor';
import {
  SERIALIZABLE_PROPERTIES_KEY,
  SERIALIZABLE_TYPES_KEY,
} from '../metadata-keys';

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

  const propertyKey = `${SERIALIZABLE_PROPERTIES_KEY}_${ctor.name}`;
  const props: Map<keyof T, Extractor> = (ctor as any)[propertyKey];

  if (!props) {
    return instance;
  }

  const keyTypesKey = `${SERIALIZABLE_TYPES_KEY}_${ctor.name}`;
  const keyTypes: Map<keyof T, any> = (ctor as any)[keyTypesKey];

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
          instance[key] = objectData;
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
          instance[key] = objectData.map(item => deserialize(keyTypeFunctionOrConstructor, item)) as any;
        } else if (typeof keyTypeFunctionOrConstructor === 'function') {
          instance[key] = objectData.map(item => {
            const itemType = keyTypeFunctionOrConstructor(item);
            if (itemType !== undefined) {
              return deserialize(itemType, item);
            }
            return item;
          }) as any;
        } else {
          instance[key] = objectData as any;
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
        instance[key] = objectData;
        return;
      }

      const keyPropertiesKey = `${SERIALIZABLE_PROPERTIES_KEY}_${keyType?.name}`;

      if (keyType[keyPropertiesKey]) {
        instance[key] = deserialize(keyType, objectData);
      } else {
        instance[key] = objectData;
      }

    }
  );

  return instance;
}
