import { Constructor } from '../../base-types/constructor';
import { ExtractorsClassStore } from '../../class-stores/extractor-store';
import { TypesClassStore } from '../../class-stores/types-store';
import { Extractor } from '../../decorators/base-extractor';
import { isConstructor } from '../../utils/is-constructor';
import { ValidationError } from '../types/validation-error';
import { ValidatorsClassStore } from '../validators-store';

/**
 * @method validate Validate javascript object
 * @param ctor { Constructor<T> } Constructor of serializable class
 * @param data { any } Object of serialized data
 * @returns { ValidationError[] } List of validation errors
 */
export function validate<T>(ctor: Constructor<T>, data: any): ValidationError[] {

  const validatorsStore = new ValidatorsClassStore(ctor);
  const validators = validatorsStore.findStoreMap();
  const props = new ExtractorsClassStore(ctor).findStoreMap();

  if (!validators || !props) {
    // TODO: Empty error list
    return [];
  }

  const keyTypes = new TypesClassStore(ctor).findStoreMap();

  let instance: T;
  try {
    instance = new ctor();
  } catch {
    // TODO: Empty error list
    return [];
  }

  const validationErrors: ValidationError[] = [];

  Array.from(validators.keys()).forEach(
    key => {

      const keyTypeFunctionOrConstructor = keyTypes?.get(key) ||
        (
          (Reflect as any).getMetadata &&
          (Reflect as any).getMetadata('design:type', instance, key as string | symbol)
        );

      const extractor: Extractor | undefined = props.get(key);

      const objectData = extractor?.extract(data);

      validationErrors.push(
        ...validators.get(key)!.map(
          Validator => new Validator().validate(objectData),
        ),
      );

      // Validate list of serializable items
      if (Array.isArray(objectData)) {
        if (isConstructor(keyTypeFunctionOrConstructor)) {
          validationErrors.push(
            ...objectData
              .map(item => validate(keyTypeFunctionOrConstructor, item))
              .flat(),
          );
        } else if (typeof keyTypeFunctionOrConstructor === 'function') {
          objectData.map(item => {
            const itemType = keyTypeFunctionOrConstructor(item);
            if (itemType !== undefined) {
              validationErrors.push(
                ...validate(itemType, item),
              );
            }
          });
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

      // Validate serializable item
      if (keyType) {
        const isKeyHasSerializableProperties = Boolean(
          new ExtractorsClassStore(keyType).findStoreMap(),
        );

        if (isKeyHasSerializableProperties) {
          validationErrors.push(
            ...validate(keyType, objectData),
          );
        }
      }

    }
  );

  return [];
}
