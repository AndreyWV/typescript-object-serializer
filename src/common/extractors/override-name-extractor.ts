import { Modifier } from '../../core/types/modifier';
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

  public static use(
    property: string,
  ): Constructor<OverrideNameExtractor> {

    return class extends OverrideNameExtractor {

      constructor(_: string, modifier?: Modifier) {

        super(
          property,
          modifier,
        );

      }

    };

  }

}
