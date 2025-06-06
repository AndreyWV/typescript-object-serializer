import { SerializerClassDataStore } from '../../utils/class-data-store';
import { Constructor } from '../../utils/constructor';

export class TypesClassStore extends SerializerClassDataStore<
  Map<
    Constructor<never>,
    (data: unknown) => boolean
  >
> {
  protected readonly storeKey = 'typescript-object-serializer_types';
}
