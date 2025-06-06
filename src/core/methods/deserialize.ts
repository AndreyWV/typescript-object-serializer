import { Constructor } from '../../utils/constructor';
import { getPropertyDescriptor } from '../../utils/get-property-descriptor';
import { KeyType } from '../../utils/key-type';
import { ExtractorsClassStore } from '../store/extractor-store';
import { ModifiersClassStore } from '../store/modifier-store';
import { TypesClassStore } from '../store/types-store';

/**
 * @method deserialize Deserialize object to class
 * @param dataConstructor { Constructor<T> } Constructor of serializable class
 * @param data { unknown } Object of serialized data
 * @returns Instance of serializable class constructor
 */
export function deserialize<T>(dataConstructor: Constructor<T>, data: unknown): T {
  const deserializer = new Deserializer(dataConstructor);
  return deserializer.deserialize(data);
}

class Deserializer<T> {

  private declare instance: T;

  private declare keyTypesStore: TypesClassStore;
  private declare extractorsStore?: ExtractorsClassStore;
  private declare modifiersStore?: ModifiersClassStore;

  constructor(
    private readonly DataConstructor: Constructor<T>,
  ) {
    try {
      this.instance = new DataConstructor();
    } catch {
      throw new Error(`[Serializer] First argument should be constructor "${DataConstructor?.toString()}"`);
    }
    this.keyTypesStore = new TypesClassStore(DataConstructor as Constructor<never>);
    this.extractorsStore = new ExtractorsClassStore(this.DataConstructor as Constructor<never>);
    this.modifiersStore = new ModifiersClassStore(this.DataConstructor as Constructor<never>);
  }

  public deserialize(data: unknown): T {
    Array.from(this.extractorsStore?.findStoreMap()?.keys() ?? []).forEach(
      key => {
        this.mapKey(key as keyof T, data);
      },
    );

    return this.instance;
  }

  private extractData(key: keyof T, data: unknown): unknown {
    const ExtractorConstructor = this.extractorsStore!.findStoreMap()!.get(key);
    const ModifierConstructor = this.modifiersStore?.findStoreMap()?.get(key);

    return ExtractorConstructor
      ? new ExtractorConstructor(
        key as string,
        ModifierConstructor
          ? new ModifierConstructor()
          : undefined,
      ).extract(data)
        .data
      : undefined;
  }

  private mapKey(key: keyof T, data: unknown): void {
    const keyType = new KeyType(this.keyTypesStore, this.instance as object, key as string | number);

    const objectData = this.extractData(key, data);

    if (!objectData) {
      /* If objectData === undefined than instance[key] should have default value from class description */
      if (objectData !== undefined) {
        /* null / 0 / '' / false */
        this.applyValue(key, objectData);
      }

      /* Not override default value declared in class constructor */
      return;
    }

    if (Array.isArray(objectData)) {
      this.applyValue(
        key,
        objectData
          .map(item => {
            const itemTypeConstructor = keyType.getConstructorForObject(item);
            return itemTypeConstructor
              ? new Deserializer(itemTypeConstructor).deserialize(item)
              : item;
          }),
      );
      return;
    }

    const keyTypeConstructor = keyType.getConstructorForObject(objectData);

    if (!keyTypeConstructor) {
      this.applyValue(key, objectData);
      return;
    }

    const isKeyHasSerializableProperties = Boolean(
      new ExtractorsClassStore(keyTypeConstructor as never).findStoreMap(),
    );

    if (isKeyHasSerializableProperties) {
      this.applyValue(
        key,
        new Deserializer(keyTypeConstructor).deserialize(objectData),
      );
    } else {
      this.applyValue(key, objectData);
    }
  }

  private applyValue(key: keyof T, value: any): void {
    const descriptor = getPropertyDescriptor(this.instance, key);
    if (!descriptor || descriptor.writable || descriptor.set) {
      this.instance[key as keyof T] = value;
    }
  }

}
