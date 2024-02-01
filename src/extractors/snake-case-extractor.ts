import { Extractor } from '../decorators/base-extractor';

export class NotStringPropertyKeyError extends Error {
  constructor(
    propertyKey: any,
  ) {
    super(`SnakeCaseExtractor should be used with object key type "string": ${String(propertyKey)}`);
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
export class SnakeCaseExtractor<T> extends Extractor<T> {

  protected static camelCaseToSnakeCase(key: string): string {
    return key.replace(
      /[A-Z\d]/g,
      letter => `_${letter.toLowerCase()}`,
    );
  }

  constructor(
    protected key: string,
  ) {
    super(key);
    if (typeof key !== 'string') {
      throw new NotStringPropertyKeyError(key);
    }
  }

  public extract(data: any): T | undefined {
    if (typeof data !== 'object' || data === null) {
      return data;
    }
    if (Array.isArray(data)) {
      return;
    }

    return this.transformBeforeExtract(
      data[SnakeCaseExtractor.camelCaseToSnakeCase(this.key)],
    );
  }

  public apply(applyObject: any, value: T): void {
    applyObject[
      SnakeCaseExtractor.camelCaseToSnakeCase(this.key)
    ] = this.transformBeforeApply(value);
  }
}
