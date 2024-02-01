import { Constructor } from '../base-types/constructor';
import { StraightExtractor } from './straight-extractor';

/**
 * @class Extractor
 * @description Basic abstract class for declaring serialize/deserialize rules
 * @example
 * class SomeClass extends SerializableObject {
 *
 *   @property(OverrideNameExtractor.use('id_property_key'))
 *   public id: string;
 *
 * }
 */
export class OverrideNameExtractor<T> extends StraightExtractor<T> {

  public static use<U, E extends Constructor<OverrideNameExtractor<U>>>(
    this: E,
    property: string,
  ): E {
    return class extends this {
      constructor(...args: any[]) {
        super(property);
      }
    };
  }
}
