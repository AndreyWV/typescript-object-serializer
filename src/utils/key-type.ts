import { TypesClassStore } from '../core/class-stores/types-store';
import { Constructor } from './constructor';

export class KeyType<T> {

  constructor(
    private store: TypesClassStore,
    private instance: object,
    private key: keyof T,
  ) {
  }

  public getConstructorForObject(objectData: unknown): Constructor<T> | undefined {

    const typesMap = this.store.findStoreMap()?.get(this.key);

    if (typesMap) {
      const MatchConstructor = typesMap.keys()
        .find(
          KeyConstructor => typesMap.get(KeyConstructor)!(objectData),
        );

      if (MatchConstructor) {
        return MatchConstructor;
      }
    }

    return Reflect?.getMetadata?.('design:type', this.instance, this.key as string | symbol);
  }

}
