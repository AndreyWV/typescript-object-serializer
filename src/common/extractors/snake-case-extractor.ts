import { Modifier } from '../../core/types/modifier';
import { StraightExtractor } from './straight-extractor';

export class NotStringPropertyKeyError extends Error {
  constructor(
    propertyKey: unknown,
  ) {
    super(`[Serializer] SnakeCaseExtractor should be used with object key type "string": ${String(propertyKey)}`);
  }
}

/**
 * @class SnakeCaseExtractor
 * @description Extract/apply property by transforming current property name to `snake_case`
 * @example
 * class SomeClass extends SerializableObject {
 *
 *   @property(SnakeCaseExtractor)
 *   public id: string;
 *
 * }
 */
export class SnakeCaseExtractor extends StraightExtractor {

  protected static camelCaseToSnakeCase(key: string): string {
    return key.replace(
      /[A-Z\d]/g,
      letter => `_${letter.toLowerCase()}`,
    );
  }

  constructor(
    key: string,
    modifier: Modifier,
  ) {
    if (typeof key !== 'string') {
      throw new NotStringPropertyKeyError(key);
    }
    super(SnakeCaseExtractor.camelCaseToSnakeCase(key), modifier);
  }

}
