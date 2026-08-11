import { SerializerClassDataStore } from '../../utils/class-data-store';
import { Constructor } from '../../utils/constructor';
import { Modifier } from '../types/modifier';

export class ModifiersClassStore extends SerializerClassDataStore<Constructor<Modifier>> {

  protected readonly storeKey = 'typescript-object-serializer_modifier';

}
