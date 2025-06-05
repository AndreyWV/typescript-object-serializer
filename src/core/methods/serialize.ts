import { SerializableObject } from '../../serializable-object';
import { deleteUndefinedRecursive } from '../../utils/delete-undefined';
import { ExtractorsClassStore } from '../class-stores/extractor-store';
import { ModifiersClassStore } from '../class-stores/modifier-store';

/**
 * @method serialize Serialize instance data
 * @param object Serializable object instance
 * @returns { object } Object of serialized data
 */
export function serialize<T extends object>(object: T): object {
  return new Serializer(object).serialize();
}


class Serializer<T extends object> {

  private declare extractorsStore?: ExtractorsClassStore;
  private declare modifiersStore?: ModifiersClassStore;

  constructor(
    private readonly objectToSerialize: T,
  ) {
    this.extractorsStore = new ExtractorsClassStore((objectToSerialize as any).constructor);
    this.modifiersStore = new ModifiersClassStore((objectToSerialize as any).constructor);
  }

  public serialize(): object {
    const data = {};

    const extractorsStore = this.extractorsStore?.findStoreMap();

    if (!extractorsStore) {
      // Return empty object if no serializable properties
      if (typeof this.objectToSerialize === 'object') {
        return data;
      }
      // Return value without changes (string / number / boolean) if it passed
      return this.objectToSerialize;
    }

    (extractorsStore.keys() as unknown as (keyof T)[]).forEach(
      (key: keyof T) => {

        const value = this.objectToSerialize[key];

        let serializedValue: unknown;
        if (Array.isArray(value)) {
          serializedValue = value
            .map(item => {
              const itemKeysStore = new ExtractorsClassStore((item as any)?.constructor)
                .findStoreMap();
              // If array items not serializable, return them as is
              if (!itemKeysStore) {
                return item;
              }
              return new Serializer(item).serialize();
            });
        } else {
          serializedValue = Serializer.isSerializableObject(value)
            ? new Serializer(value).serialize()
            : value;
        }

        this.applySerializedValue(data, key, serializedValue);

      },
    );

    return deleteUndefinedRecursive(data);
  }

  private applySerializedValue(
    data: Record<string, unknown>,
    key: keyof T,
    serializedValue: unknown,
  ): void {
    const PropertyExtractor = this.extractorsStore!.findStoreMap()!.get(key);

    if (!PropertyExtractor) {
      return;
    }

    const Modifier = this.modifiersStore?.findStoreMap()?.get(key);

    new PropertyExtractor(
      key as string,
      Modifier
        ? new Modifier()
        : undefined,
    ).apply(data, serializedValue);
  }

  private static isSerializableObject(value: unknown): value is object {
    return value instanceof SerializableObject
      || Boolean(
        new ExtractorsClassStore((value as any)?.constructor).findStoreMap(),
      );
  }

}
