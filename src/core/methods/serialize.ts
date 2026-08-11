import { SerializableObject } from '../../serializable-object';
import { Constructor } from '../../utils/constructor';
import { deleteUndefinedRecursive } from '../../utils/delete-undefined';
import { ExtractorsClassStore } from '../store/extractor-store';
import { ModifiersClassStore } from '../store/modifier-store';

/**
 * @method serialize Serialize instance data
 * @param object Serializable object instance
 * @returns { Record<string, unknown> } Object of serialized data
 */
export function serialize<T extends object>(object: T): Record<string, unknown> {

  return new Serializer(object)
    .serialize();

}

class Serializer<T extends object> {

  private declare readonly extractorsStore?: ExtractorsClassStore;

  private declare readonly modifiersStore?: ModifiersClassStore;

  constructor(
    private readonly objectToSerialize: T,
  ) {

    this.extractorsStore = new ExtractorsClassStore(
      (objectToSerialize as { constructor: Constructor<never>; }).constructor,
    );
    this.modifiersStore = new ModifiersClassStore(
      (objectToSerialize as { constructor: Constructor<never>; }).constructor,
    );

  }

  public serialize(): Record<string, unknown> {

    const serializationResult = {};

    const extractorsStore = this.extractorsStore?.findStoreMap();

    if (!extractorsStore) {

      // Return empty object if no serializable properties
      if (typeof this.objectToSerialize === 'object') {

        return serializationResult;

      }
      // Return value without changes (string / number / boolean) if it passed
      return this.objectToSerialize;

    }

    (Array.from(extractorsStore.keys()) as (keyof T)[]).forEach(
      (key: keyof T) => {

        const value = this.objectToSerialize[key];

        let serializedValue: unknown;
        if (Array.isArray(value)) {

          serializedValue = this.serializeArray(value as T[keyof T] & never[]);

        } else {

          serializedValue = Serializer.isSerializableObject(value)
            ? new Serializer(value)
              .serialize()
            : value;

        }

        this.applySerializedValue(serializationResult, key, serializedValue);

      },
    );

    return deleteUndefinedRecursive(serializationResult);

  }

  private serializeArray(value: T[keyof T] & never[]): unknown {

    return value
      .map(item => {

        const itemKeysStore = new ExtractorsClassStore(
          (item as { constructor: Constructor<never>; })?.constructor,
        )
          .findStoreMap();
        // If array items not serializable, return them as is
        if (!itemKeysStore) {

          return item;

        }
        return new Serializer(item)
          .serialize();

      });

  }

  private applySerializedValue(
    data: Record<string, unknown>,
    key: keyof T,
    serializedValue: unknown,
  ): void {

    const propertyExtractorConstructor = this.extractorsStore!.findStoreMap()!.get(key);

    if (!propertyExtractorConstructor) {

      return;

    }

    const modifierConstructor = this.modifiersStore?.findStoreMap()
      ?.get(key);

    new propertyExtractorConstructor(
      key as string,
      modifierConstructor
        ? new modifierConstructor()
        : undefined,
    )
      .apply(data, serializedValue);

  }

  private static isSerializableObject(value: unknown): value is object {

    return value instanceof SerializableObject
      || Boolean(
        new ExtractorsClassStore(
          (value as { constructor: Constructor<never>; })
            ?.constructor,
        )
          .findStoreMap(),
      );

  }

}
