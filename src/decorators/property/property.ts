import { Constructor } from '../../base-types/constructor';
import { SERIALIZABLE_PROPERTIES_KEY } from '../../metadata-keys';
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
  return (target: any, propertyKey: string | symbol, index?: number) => {

    let ctor;

    if (propertyKey === undefined && target['prototype'] && index !== undefined) {
      const extractedPropertyKey = getConstructorPropertyName(target['prototype'].constructor, index as number);
      if (!extractedPropertyKey) {
        return;
      }
      propertyKey = extractedPropertyKey;
      ctor = target['prototype'].constructor;
    }

    if (!ctor) {
      ctor = target.constructor;
    }

    const propertiesKey = `${SERIALIZABLE_PROPERTIES_KEY}_${ctor.name}`;

    if (!ctor[propertiesKey]) {
      const parentProperties = getSerializableProperties(ctor.__proto__);
      ctor[propertiesKey] = new Map<string | symbol, Extractor>(parentProperties);
    }

    const keysStore: Map<string | symbol, Extractor> =
      ctor[propertiesKey];

    keysStore.set(propertyKey, new extractor(propertyKey));

  }
}
