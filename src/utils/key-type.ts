import { TypesClassStore } from '../core/store/types-store';
import { Constructor } from './constructor';

export class KeyType<T> {

  public static readonly defaultPropertyTypeCondition = (): boolean => true;

  constructor(
    private store: TypesClassStore,
    private instance: object,
    private key: keyof T,
  ) {
  }

  public getConstructorForObject(objectData: unknown): Constructor<T> | undefined {
    return this.getTypeFromDecorator(objectData)
      ?? Reflect?.getMetadata?.('design:type', this.instance, this.key as string | symbol);
  }

  private getTypeFromDecorator(objectData: unknown): Constructor<T> | undefined {
    const typesMap = this.store.findStoreMap()
      ?.get(this.key);

    if (!typesMap) {
      return;
    }

    const MatchConstructor = Array.from(typesMap.keys())
      // Check only conditional types first
      .filter(
        (KeyConstructor: Constructor<never>) => typesMap.get(KeyConstructor) !== KeyType.defaultPropertyTypeCondition,
      )
      .find(
        (KeyConstructor: Constructor<never>) => typesMap.get(KeyConstructor)!(objectData),
    )
      // If No one condition matched - apply default type 
      ?? Array.from(typesMap.keys())
        .find(
          (KeyConstructor: Constructor<never>) => typesMap.get(KeyConstructor) === KeyType.defaultPropertyTypeCondition,
        );

    return MatchConstructor;

  }

}
