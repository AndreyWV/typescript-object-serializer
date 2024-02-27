import { SerializerClassDataStore } from '../utils/class-data-store';

export class TypesClassStore<T> extends SerializerClassDataStore<T, any> {
  protected key = 'typescript-object-serializer_types';
}
