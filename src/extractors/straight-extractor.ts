import {
  ExtractionResult,
  Extractor,
} from '../decorators/base-extractor';

/**
 * @class StraightExtractor
 * @description Extract/apply property with same name
 * @example
 * class SomeClass extends SerializableObject {
 *
 *   @property(StraightExtractor)
 *   public id: string;
 *
 * }
 */
export class StraightExtractor<T> extends Extractor<T> {
  public extract(data: any): ExtractionResult<T> {
    if (typeof data !== 'object' || data === null) {
      return {
        data,
        path: this.key,
      };
    }
    if (Array.isArray(data)) {
      return {
        data: undefined,
        path: this.key,
      };
    } return {
      data: this.transformBeforeExtract(data[this.key]),
      path: this.key,
    };
  }

  public apply(applyObject: any, value: T): void {
    applyObject[this.key] = this.transformBeforeApply(value);
  }
}
