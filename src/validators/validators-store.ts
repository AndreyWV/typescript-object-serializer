import { Constructor } from '../base-types/constructor';
import { SerializerClassDataStore } from '../utils/class-data-store';
import { Validator } from './types/validator';

export class ValidatorsClassStore<T> extends SerializerClassDataStore<T, Constructor<Validator>[]> {
  protected key = 'typescript-object-serializer_validators';
}
