import { Extractor } from './extractor.base';

export class ExtractorCamelCase extends Extractor {

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
      throw new Error('ExtractorCamelCase should be used with object key type `string`')
    }
  }

  public extract(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }
    if (Array.isArray(data)) {
      return;
    }

    return data[ExtractorCamelCase.camelCaseToSnakeCase(this.key)];
  }

  public apply(applyObject: any, value: any): void {
    console.log(ExtractorCamelCase.camelCaseToSnakeCase(this.key));
    applyObject[ExtractorCamelCase.camelCaseToSnakeCase(this.key)] = value;
  }
}
