import { SerializerClassDataStore } from '../../../utils/class-data-store';
import { Constructor } from '../../../utils/constructor';
import { Validator } from '../types/validator';

export class ValidatorsClassStore extends SerializerClassDataStore<Constructor<Validator>[]> {

  protected storeKey = 'typescript-object-serializer_validators';

}
