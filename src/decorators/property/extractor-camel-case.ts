import { Extractor } from './extractor.base';

export class NotStringPropertyKeyError extends Error {
  constructor(
    propertyKey: any,
  ) {
    super(`ExtractorCamelCase should be used with object key type "string": ${String(propertyKey)}`);
  }
}

export class ExtractorCamelCase<T> extends Extractor<T> {

  private static camelCaseToSnakeCase(key: string): string {
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

    const value = data[ExtractorCamelCase.camelCaseToSnakeCase(this.key)];

    return this.transformOnDeserialize ?
      this.transformOnDeserialize(value) :
      value;
  }

  public apply(applyObject: any, value: T): void {
    applyObject[ExtractorCamelCase.camelCaseToSnakeCase(this.key)] = this.transformOnSerialize ?
      this.transformOnSerialize(value) :
      value;
  }
}
