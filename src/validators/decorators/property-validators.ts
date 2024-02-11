import { Constructor } from '../../base-types/constructor';
import { getConstructorPropertyName } from '../../utils/get-constructor-property-name';
import { Validator } from '../types/validator';
import { ValidatorsClassStore } from '../validators-store';

/**
 * @function propertyValidators Declares validators for current property on deserialization
 * @param validators { Constructor<Validator>[] } List of validators on current property
 * @example
 * class SomeClass extends SerializableObject {
 *
 *   @propertyValidators([RequiredValidator, RegExpStringValidator])
 *   public id: string;
 *
 * }
 */
export function propertyValidators(
  validators: Constructor<Validator>[],
)/* : PropertyDecorator | ParameterDecorator */ {
  return (target: any, propertyKey: string | symbol | undefined, indexOrDescriptor?: number | PropertyDescriptor) => {

    let ctor;

    if (propertyKey === undefined && target['prototype'] && typeof indexOrDescriptor === 'number') {
      const extractedPropertyKey = getConstructorPropertyName(target['prototype'].constructor, indexOrDescriptor as number);
      if (!extractedPropertyKey) {
        return;
      }
      propertyKey = extractedPropertyKey;
      ctor = target['prototype'].constructor;
    }

    if (!ctor) {
      ctor = target.constructor;
    }

    const validatorsStore = new ValidatorsClassStore<any>(ctor);

    if (!validatorsStore.getStoreMap()) {
      const parentProperties = new ValidatorsClassStore(ctor.__proto__)
        .findStoreMap() as Map<string | number, any> | undefined;
      validatorsStore.defineStoreMap(parentProperties);
    }

    const keysStore = validatorsStore.getStoreMap();

    if (!keysStore) {
      return;
    }

    const propertyKeyParentValidators = keysStore.get(propertyKey as string | symbol);
    const allValidators = ([] as Constructor<Validator>[]).concat(propertyKeyParentValidators ?? [], validators);

    keysStore.set(propertyKey as string | symbol, allValidators);

  }
}
