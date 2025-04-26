import { Constructor } from '../base-types/constructor';

type SerializerClassDataStoreContainer<T, S> = Constructor<T> & {
  [key: string]: Map<unknown, Map<keyof T, S>>;
};

/**
 * @class SerializerClassDataStore Stores metadata for serializer methods
 * T - Type of class for which store is created
 * S - Type of stored value
 */
export abstract class SerializerClassDataStore<T, S> {

  private static readonly rootObjectPrototype = ({} as any).prototype;
  private static readonly SEARCH_STORE_DEPTH = 5;

  protected abstract storeKey: string;

  constructor(
    private readonly SerializerClassConstructor: Constructor<T>,
  ) {
  }

  /**
   * @method getStoreMap
   * @returns Map with keys - object properties, values - stored value for current Store
   */
  public getStoreMap(): Map<keyof T, S> | undefined {
    return this.getOrCreateStoreMap()
      .get(this.SerializerClassConstructor);
  }

  /**
   * @method findStoreMap
   * Deeply looks for store map at current class and its parents
   */
  public findStoreMap(): Map<keyof T, S> | undefined {

    let currentIterationConstructor = this.SerializerClassConstructor as
      SerializerClassDataStoreContainer<T, S> | undefined;
    let depthLevel = SerializerClassDataStore.SEARCH_STORE_DEPTH;

    while (depthLevel !== 0) {
      if (currentIterationConstructor?.prototype === SerializerClassDataStore.rootObjectPrototype) {
        return;
      }
      const parentStore = new (this['constructor'] as Constructor<SerializerClassDataStore<T, S>>)(
        currentIterationConstructor,
      );
      const parentStoreMap = parentStore.getStoreMap();
      if (parentStoreMap) {
        return parentStoreMap;
      }
      currentIterationConstructor = (currentIterationConstructor as SerializerClassDataStoreContainer<T, S>)
        .__proto__ as unknown as (SerializerClassDataStoreContainer<T, S> | undefined);
      if (!currentIterationConstructor) {
        break;
      }
      depthLevel--;
    }
  }

  /**
   * @method defineStoreMap
   * Creates store map for store metadata
   * If parentProperties are passed - they used as default values of store
   */
  public defineStoreMap(parentProperties?: Map<keyof T, S>): void {
    const storeMap = this.getOrCreateStoreMap();
    if (!storeMap.get(this.SerializerClassConstructor)) {
      storeMap.set(
        this.SerializerClassConstructor,
        new Map(parentProperties),
      );
    }
  }

  private getOrCreateStoreMap(): Map<unknown, Map<keyof T, S>> {
    const serializerClassConstructor = this.SerializerClassConstructor as SerializerClassDataStoreContainer<T, S>;
    if (!serializerClassConstructor[this.storeKey]) {
      serializerClassConstructor[this.storeKey] = new Map();
    }
    return serializerClassConstructor[this.storeKey];
  }
}
