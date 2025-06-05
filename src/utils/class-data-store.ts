import { Constructor } from './constructor';

type SerializerClassDataStoreContainer<T, S> = Constructor<T> & {
  [key: string]: Map<unknown, Map<keyof T, S>>;
};

/**
 * @class SerializerClassDataStore Stores metadata for serializer methods
 * T - Type of class for which store is created
 * S - Type of stored value
 */
export abstract class SerializerClassDataStore<S, T = never> {

  /**
   * Prototype of root object - used to stop search for store map
   */
  private static readonly rootObjectPrototype = ({} as typeof Object).prototype;

  /**
   * Depth of search for store map in parent classes to prevent deep recursive
   */
  private static readonly SEARCH_STORE_DEPTH = 5;

  /**
   * @property storeKey - key of store map
   * Key must be unique for each serializer entity
   */
  protected abstract storeKey: string;

  constructor(
    /**
     * Constructor of serializable class for declaring and extracting serializer rules
     */
    private readonly SerializerClassConstructor: Constructor<never>,
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

  public getStoreMapOrDeclareFromParent(): Map<keyof T, S> {
    const storeMap = this.getStoreMap();
    if (storeMap) {
      return storeMap;
    }
    const parentStore = new (this['constructor'] as Constructor<SerializerClassDataStore<S, T>>)(
      (this.SerializerClassConstructor as any).__proto__,
    );
    const parentProperties = parentStore.findStoreMap();
    this.defineStoreMap(parentProperties);
    return this.getStoreMap()!;
  }

  /**
   * @method findStoreMap
   * Deeply looks for store map at current class and its parents
   */
  public findStoreMap(): Map<keyof T, S> | undefined {

    let currentIterationConstructor = this.SerializerClassConstructor as
      unknown as
      SerializerClassDataStoreContainer<T, S>
      | undefined;
    let currentIterationLevel = SerializerClassDataStore.SEARCH_STORE_DEPTH;

    /**
     * Stop search if max depth is reached
     */
    while (currentIterationLevel !== 0) {
    /**
     * Stop search if root object prototype is reached
     * Root object can't contain any serializer rules
     */
      if (currentIterationConstructor?.prototype === SerializerClassDataStore.rootObjectPrototype) {
        return;
      }
      /**
       * Search rules at parent
       */
      const parentStore = new (this['constructor'] as Constructor<SerializerClassDataStore<S, T>>)(
        currentIterationConstructor,
      );
      const parentStoreMap = parentStore.getStoreMap();
      if (parentStoreMap) {
        return parentStoreMap;
      }
      /**
       * Move to parent
       */
      currentIterationConstructor = (currentIterationConstructor as SerializerClassDataStoreContainer<T, S>)
        .__proto__ as unknown as (SerializerClassDataStoreContainer<T, S> | undefined);
      /**
       * Just in case
       */
      if (!currentIterationConstructor) {
        break;
      }
      currentIterationLevel--;
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
    const serializerClassConstructor = this.SerializerClassConstructor as
      unknown as
      SerializerClassDataStoreContainer<T, S>;

    if (!serializerClassConstructor[this.storeKey]) {
      serializerClassConstructor[this.storeKey] = new Map();
    }
    return serializerClassConstructor[this.storeKey];
  }
}
