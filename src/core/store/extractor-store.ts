import { SerializerClassDataStore } from '../../utils/class-data-store';
import { Constructor } from '../../utils/constructor';
import { Extractor } from '../types/extractor';
import { Modifier } from '../types/modifier';

export class ExtractorsClassStore extends SerializerClassDataStore<Constructor<Extractor, string, Modifier>> {
  protected readonly storeKey = 'typescript-object-serializer_props';
}
