import { Constructor } from '../../base-types/constructor';
import { SERIALIZABLE_PROPERTIES_KEY } from '../../metadata-keys';
import { StraightExtractor } from './straight-extractor';
import { Extractor } from './base-extractor';
import { SerializableObject } from '../..';

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
): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {

    if (!target.constructor[SERIALIZABLE_PROPERTIES_KEY]) {
      target.constructor[SERIALIZABLE_PROPERTIES_KEY] =
        new Map<string | symbol, Extractor>();
    }

    const keysStore: Map<string | symbol, Extractor> =
      target.constructor[SERIALIZABLE_PROPERTIES_KEY];

    keysStore.set(propertyKey, new extractor(propertyKey));

  }
}
