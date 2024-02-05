import { Constructor } from '../../base-types/constructor';
import { ExtractorsClassStore } from '../../class-stores/extractor-store';
import { TypesClassStore } from '../../class-stores/types-store';
import { Extractor } from '../../decorators/base-extractor';
import { KeyType } from '../../utils/key-type';
import { ValidationError } from '../types/validation-error';
import { ValidatorsClassStore } from '../validators-store';

/**
 * @method validate Validate javascript object
 * @param ctor { Constructor<T> } Constructor of serializable class
 * @param data { any } Object of serialized data
 * @returns { ValidationError[] } List of validation errors
 */
export function validate<T>(ctor: Constructor<T>, data: any): ValidationError[] {

  const props = new ExtractorsClassStore(ctor).findStoreMap();

  if (!props) {
    return [];
  }

  const keyTypesStore = new TypesClassStore(ctor);

  let instance: T;
  try {
    instance = new ctor();
  } catch {
    return [];
  }

  const validationErrors: ValidationError[] = [];

  const validatorsStore = new ValidatorsClassStore(ctor).findStoreMap();

  Array.from(props.keys()).forEach(
    key => {

      const keyValidators = validatorsStore?.get(key);

      const keyType = new KeyType(keyTypesStore, instance, key);

      const extractor: Extractor | undefined = props.get(key);

      const extractionResult = extractor?.extract(data);
      const objectData = extractionResult?.data;

      if (keyValidators) {
        validationErrors.push(
          ...keyValidators
            .map(
              Validator => new Validator().validate(objectData, extractionResult?.path ?? ''),
            )
            .filter(
              e => e instanceof ValidationError,
            ) as ValidationError[],
        );
      }

      // Validate list of serializable items
      if (Array.isArray(objectData)) {
        if (keyType.isConstructor) {
          validationErrors.push(
            ...objectData
              .map(item => validate(keyType.keyConstructor!, item))
              .map((itemErrors, itemIndex) => {
                return itemErrors.map(
                  error => {
                    error.path = `${extractionResult?.path}.[${itemIndex}].${error.path}`;
                    return error;
                  },
                );
              })
              .flat(),
          );
        } else if (keyType.isFunction) {
          objectData.map(item => {
            const itemType = keyType.getTypeFromFunction(item);
            if (itemType !== undefined) {
              validationErrors.push(
                ...validate(itemType, item)
                  .map(
                    error => {
                      error.path = `${extractionResult?.path}.${error.path}`;
                      return error;
                    },
                  ),
              );
            }
          });
        }
        return;
      }

      const keyTypeConstructor = keyType.isConstructor ?
        keyType.keyConstructor :
        keyType.getTypeFromFunction(objectData);

      // Validate serializable item
      if (keyType) {
        const isKeyHasSerializableProperties = Boolean(
          new ExtractorsClassStore(keyTypeConstructor).findStoreMap(),
        );

        if (isKeyHasSerializableProperties) {
          validationErrors.push(
            ...validate(keyTypeConstructor, objectData)
              .map(
                error => {
                  error.path = `${extractionResult?.path}.${error.path}`;
                  return error;
                },
              ),
          );
        }
      }

    }
  );

  return validationErrors;
}
