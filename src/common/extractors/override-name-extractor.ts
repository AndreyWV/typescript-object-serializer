import { Constructor } from '../../utils/constructor';
import { StraightExtractor } from './straight-extractor';

/**
 * @class OverrideNameExtractor
 * @description Class for overriding property name for extracting/applying
 * @example
 * class SomeClass extends SerializableObject {
 *
 *   @property(OverrideNameExtractor.use('id_property_key'))
 *   public id: string;
 *
 * }
 */
export class OverrideNameExtractor extends StraightExtractor {

  public static use<E extends Constructor<OverrideNameExtractor>>(
    this: E,
    property: string,
  ): E {
    return class extends this {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      constructor(...args: any[]) {
        super(property);
      }
    };
  }
}
