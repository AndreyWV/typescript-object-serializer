import { Constructor } from '../../base-types/constructor';
import { ExtractorsClassStore } from '../../class-stores/extractor-store';
import { TypesClassStore } from '../../class-stores/types-store';
import { Extractor } from '../../decorators/base-extractor';
import { KeyType } from '../../utils/key-type';
import { ValidationError } from '../types/validation-error';
import { ValidatorsClassStore } from '../validators-store';

const PATH_SEPARATOR = '.';

/**
 * @method validate Validate javascript object
 * @param ctor { Constructor<T> } Constructor of serializable class
 * @param data { any } Object of serialized data
 * @returns { ValidationError[] } List of validation errors. Returns empty array if object is valid.
 */
export function validate<T>(ctor: Constructor<T>, data: any | any[]): ValidationError[] {

  if (Array.isArray(data)) {
    return data
      .map(item => validate(ctor, item))
      .map(
        (validationErrors, index) => {
          return validationErrors.map(
            validationError => ({
              ...validationError,
              path: `[${index}]${PATH_SEPARATOR}${validationError.path}`,
            }),
          );
        },
      )
      .flat();
  }

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
        validationErrors.push(
          ...objectData
            .map<{ itemData: any, itemType?: Constructor<T> }>(itemData => ({
              itemData,
              itemType: keyType.getConstructorForObject(itemData),
            }))
            .filter(item => item.itemType)
            .map(item => validate(item.itemType!, item.itemData))
            .map((itemErrors, itemIndex) => {
              return itemErrors.map(
                error => {
                  error.path = `${extractionResult?.path}${PATH_SEPARATOR}[${itemIndex}]${PATH_SEPARATOR}${error.path}`;
                  return error;
                },
              );
            })
            .flat(),
        );
        return;
      }

      const keyTypeConstructor = keyType.getConstructorForObject(objectData);

      // Validate serializable item
      if (keyTypeConstructor) {
        const isKeyHasSerializableProperties = Boolean(
          new ExtractorsClassStore(keyTypeConstructor).findStoreMap(),
        );

        if (isKeyHasSerializableProperties) {
          validationErrors.push(
            ...validate(keyTypeConstructor, objectData)
              .map(
                error => {
                  error.path = `${extractionResult?.path}${PATH_SEPARATOR}${error.path}`;
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
