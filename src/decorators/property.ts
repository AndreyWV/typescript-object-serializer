import { Constructor } from '../base-types/constructor';
import { ExtractorsClassStore } from '../class-stores/extractor-store';
import { StraightExtractor } from '../extractors/straight-extractor';
import { getConstructorPropertyName } from '../utils/get-constructor-property-name';
import { Extractor } from './base-extractor';

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

    const propertiesStore = new ExtractorsClassStore<any>(ctor);

    if (!propertiesStore.getStoreMap()) {
      const parentProperties = new ExtractorsClassStore(ctor.__proto__)
        .findStoreMap() as Map<string | number, any> | undefined;
      propertiesStore.defineStoreMap(parentProperties);
    }

    const keysStore = propertiesStore.getStoreMap();

    keysStore?.set(propertyKey as string | symbol, new extractor(propertyKey));

  }
}
