import { SerializerClassDataStore } from '../utils/class-data-store';

export class TypesClassStore<T> extends SerializerClassDataStore<T, any> {
  protected readonly storeKey = 'typescript-object-serializer_types';
}
