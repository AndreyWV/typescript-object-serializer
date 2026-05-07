import { TypesClassStore } from '../core/store/types-store';
import { Constructor } from './constructor';

export class KeyType<T> {

  public static readonly defaultPropertyTypeCondition = (): boolean => true;

  constructor(
    private readonly store: TypesClassStore,
    private readonly instance: object,
    private readonly key: keyof T,
  ) {
  }

  public getConstructorForObject(objectData: unknown): Constructor<T> | undefined {

    return this.getTypeFromDecorator(objectData)
      ?? Reflect?.getMetadata?.('design:type', this.instance, this.key as string | symbol);

  }

  public getTypeFromDecorator(objectData: unknown): Constructor<T> | undefined {

    const typesMap = this.store.findStoreMap()
      ?.get(this.key);

    if (!typesMap) {

      return;

    }

    return Array.from(typesMap.keys())
      // Sort to place default type at the end
      .sort(
        (a: Constructor<never>, b: Constructor<never>) =>
          (
            typesMap.get(b) !== KeyType.defaultPropertyTypeCondition
            && typesMap.get(a) === KeyType.defaultPropertyTypeCondition
          )
            ? 1
            : -1,
      )
      // Find matched type
      .find(
        (KeyConstructor: Constructor<never>) => typesMap.get(KeyConstructor)!(objectData),
      );

  }

}
