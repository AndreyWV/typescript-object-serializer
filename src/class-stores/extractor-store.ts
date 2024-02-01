import { Extractor } from '../decorators/base-extractor';
import { SerializerClassDataStore } from '../utils/class-data-store';

export class ExtractorsClassStore<T> extends SerializerClassDataStore<T, Extractor> {
  protected key = 'typescript-object-serializer_props';
}
