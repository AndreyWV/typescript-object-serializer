import { ExtractorsClassStore } from '../../../core/store/extractor-store';
import { ModifiersClassStore } from '../../../core/store/modifier-store';
import { TypesClassStore } from '../../../core/store/types-store';
import { ExtractionResult } from '../../../core/types/extractor';
import { Constructor } from '../../../utils/constructor';
import { KeyType } from '../../../utils/key-type';
import { ValidatorsClassStore } from '../store/validators-store';
import { ValidationError } from '../types/validation-error';

/**
 * @method validate Validate javascript object
 * @param constructor { Constructor<T> } Constructor of serializable class
 * @param data { any } Object of serialized data
 * @returns { ValidationError[] } List of validation errors. Returns empty array if object is valid.
 */
export function validate<T>(constructor: Constructor<T>, data: unknown | unknown[]): ValidationError[] {
  const validator = new Validator(constructor);
  return Array.isArray(data)
    ? validator.validateArray(data)
    : validator.validate(data as T);
}

class Validator<T> {

  private static readonly PATH_SEPARATOR = '.';

  private readonly instance?: T;

  private declare keyTypesStore: TypesClassStore;
  private declare extractorsStore?: ExtractorsClassStore;
  private declare modifiersStore?: ModifiersClassStore;
  private declare validatorsStore?: ValidatorsClassStore;

  constructor(
    DataConstructor: Constructor<T>,
  ) {
    try {
      this.instance = new DataConstructor();
    } catch { /* empty */ }
    this.keyTypesStore = new TypesClassStore(DataConstructor as Constructor<never>);
    this.extractorsStore = new ExtractorsClassStore(DataConstructor as Constructor<never>);
    this.modifiersStore = new ModifiersClassStore(DataConstructor as Constructor<never>);
    this.validatorsStore = new ValidatorsClassStore(DataConstructor as Constructor<never>);
  }

  public validate(data: unknown): ValidationError[] {
    const extractors = this.extractorsStore?.findStoreMap();

    if (!this.instance || !extractors) {
      return [];
    }

    return Array.from(extractors.keys())
      .reduce(
        (errors, key) => {

          if (!this.isShouldValidateKey(key as keyof T)) {
            return errors;
          }

          const extractionResult = this.extractKey(data, key as keyof T);

          return this.validateKeyItself(key as keyof T, extractionResult)
            .concat(
              this.validateKeyAsArray(key as keyof T, extractionResult),
              this.validateKeyDeepProperties(key as keyof T, extractionResult),
            );
        },
        [] as ValidationError[],
      );

  }

  public validateArray(data: unknown[]): ValidationError[] {
    return data
      .map(item => this.validate(item))
      .map(
        (validationErrors, index) => {
          return validationErrors.map(
            validationError => {
              // TODO add method <cloneWith> and override path
              validationError.path = `[${index}]${Validator.PATH_SEPARATOR}${validationError.path}`;
              return validationError;
            },
          );
        },
      )
      .flat();
  }

  private isShouldValidateKey(key: keyof T): boolean {
    return Boolean(
      this.extractorsStore?.findStoreMap()?.get(key as string),
    );
  }

  private extractKey(data: unknown, key: keyof T): ExtractionResult {
    const KeyExtractor = this.extractorsStore!.findStoreMap()!.get(key as string)!;
    const KeyModifier = this.modifiersStore?.findStoreMap()?.get(key as string);

    return new KeyExtractor(
      key as string,
      KeyModifier
        ? new KeyModifier()
        : undefined,
    ).extract(data);
  }

  private validateKeyItself(key: keyof T, extractionResult: ExtractionResult): ValidationError[] {

    const keyValidators = this.validatorsStore?.findStoreMap()?.get(key);

    if (!keyValidators) {
      return [];
    }

    return keyValidators
      .map(
        KeyValidator => new KeyValidator()
          .validate(
            extractionResult.data,
            extractionResult.path,
          ),
      )
      .filter(
        e => e instanceof ValidationError,
      ) as ValidationError[];
  }

  private validateKeyAsArray(key: keyof T, extractionResult: ExtractionResult): ValidationError[] {
    if (!Array.isArray(extractionResult.data)) {
      return [];
    }

    const keyType = new KeyType(this.keyTypesStore, this.instance as object, key as string | number);

    return extractionResult.data
      .map<{ itemData: unknown, itemType?: Constructor<T>; }>(
        itemData => ({
          itemData,
          itemType: keyType.getConstructorForObject(itemData) as Constructor<never>,
        }),
      )
      .filter(item => item.itemType)
      .map(
        item =>
          new Validator(item.itemType!)
            .validate(item.itemData as any),
      )
      .map(
        (itemErrors, itemIndex) => {
          return itemErrors.map(
            error => {
              error.path = [
                extractionResult?.path ?? '',
                `[${itemIndex}]`,
                error.path,
              ]
                .join(Validator.PATH_SEPARATOR);
              return error;
            },
          );
        },
      )
      .flat();
  }

  private validateKeyDeepProperties(key: keyof T, extractionResult: ExtractionResult): ValidationError[] {
    const value = extractionResult.data;

    if (typeof value !== 'object' || value === null) {
      return [];
    }

    const KeyTypeConstructor = new KeyType(this.keyTypesStore, this.instance as object, key as string | number)
      .getConstructorForObject(value);

    if (!KeyTypeConstructor) {
      return [];
    }

    const isKeyHasSerializableProperties = Boolean(
      new ExtractorsClassStore(KeyTypeConstructor as Constructor<never>)
        .findStoreMap(),
    );

    if (!isKeyHasSerializableProperties) {
      return [];
    }

    return new Validator(KeyTypeConstructor as Constructor<never>)
      .validate(value as never)
      .map(
        error => {
          error.path = `${extractionResult?.path}${Validator.PATH_SEPARATOR}${error.path}`;
          return error;
        },
      );

  }

}
