import { Constructor } from '../../base-types/constructor';
import {
  definePropertiesKeys,
  getPropertiesKeys,
} from '../../serializable-properties';
import { getConstructorPropertyName } from '../../utils/get-constructor-property-name';
import { getSerializableProperties } from '../../utils/get-serializable-properties';
import { Extractor } from './base-extractor';
import { StraightExtractor } from './straight-extractor';

/**
 * @function property Declares serialize/deserialize rules for current property
 * @param extractor { Extractor } Extractor that extracts data from serialized data and applies data to serialized data
 * @example
 * class SomeClass extends SerializableObject {
 *
 *   @property()
 *   public id: string;
 *
 * }
 */
export function property(
  extractor: Constructor<Extractor> = StraightExtractor,
)/* : PropertyDecorator | ParameterDecorator */ {
  return (target: any, propertyKey: string | symbol, indexOrDescriptor?: number | PropertyDescriptor) => {

    let ctor;

    if (propertyKey === undefined && target['prototype'] && typeof indexOrDescriptor === 'number' ) {
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

    const properties = getPropertiesKeys(ctor);

    if (!properties) {
      const parentProperties = getSerializableProperties(ctor.__proto__);
      definePropertiesKeys(ctor, parentProperties);
    }

    const keysStore = getPropertiesKeys(ctor) as Map<string | Symbol, Extractor>;

    keysStore.set(propertyKey, new extractor(propertyKey));

  }
}
