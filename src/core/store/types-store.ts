import { SerializerClassDataStore } from '../../utils/class-data-store';
import { Constructor } from '../../utils/constructor';

type TypesStoreType = Map<
  Constructor<never>,
  (data: unknown) => boolean
  >;

export class TypesClassStore extends SerializerClassDataStore<TypesStoreType> {

  protected readonly storeKey = 'typescript-object-serializer_types';

  public override defineStoreMap(parentProperties?: Map<keyof never, TypesStoreType>): void {
    const storeMap = this.getOrCreateStoreMap();
    if (!storeMap.get(this.SerializerClassConstructor)) {
      storeMap.set(
        this.SerializerClassConstructor,
        new Map(
          // Create copy of property conditions to not affect parent class
          // backward compatibility with node 20 and less
          // Change `Array.from(parentProperties?.entries() ?? [])` -> `parentProperties?.entries()` later
          Array.from(parentProperties?.entries() ?? [])
            .map(([key, value]) => [key, new Map(value)]),
        ),
      );
    }
  }
}
