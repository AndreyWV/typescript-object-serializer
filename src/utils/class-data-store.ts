import { Constructor } from '../base-types/constructor';

/**
 * @class SerializerClassDataStore Stores metadata for serializer methods
 */
export abstract class SerializerClassDataStore<T = any, S = any> {

  private static rootObjectPrototype = ({} as any).prototype;
  private static SEARCH_STORE_DEPTH = 5;

  protected abstract key: string;

  constructor(
    private ctor: Constructor<T>,
  ) {
  }

  /**
   * @method getStoreMap
   * @returns Map with keys - object properties, values - stored value for current Store
   */
  public getStoreMap(): Map<keyof T, S> | undefined {
    return this.getOrCreateStoreMap().get(this.ctor);
  }

  /**
   * @method findStoreMap
   * Deeply looks for store map at current class and its parents
   */
  public findStoreMap(): Map<keyof T, S> | undefined {

    if (!this.ctor) {
      return;
    }

    let currentCtor = this.ctor;

    let i = SerializerClassDataStore.SEARCH_STORE_DEPTH;

    while (i !== 0) {
      if (currentCtor?.prototype === SerializerClassDataStore.rootObjectPrototype) {
        return;
      }
      const parentStore = new (this['constructor'] as Constructor<SerializerClassDataStore<T>>)(currentCtor);
      const parentStoreMap = parentStore.getStoreMap();
      if (parentStoreMap) {
        return parentStoreMap;
      }
      currentCtor = (currentCtor as any).__proto__;
      if (!currentCtor) {
        break;
      }
      i--;
    }
  }

  /**
   * @method defineStoreMap
   * Creates store map for store metadata
   * If parentProperties are passed - they used as default values of store
   */
  public defineStoreMap<T>(parentProperties?: Map<keyof T, S>): void {
    const storeMap = this.getOrCreateStoreMap();
    if (!storeMap.get(this.ctor)) {
      storeMap.set(this.ctor, new Map(parentProperties as any));
    }
  }

  private getOrCreateStoreMap<T>(): Map<any, Map<keyof T, S>> {
    if (!(this.ctor as any)[this.key]) {
      (this.ctor as any)[this.key] = new Map();
    }
    return (this.ctor as any)[this.key];
  }
}
