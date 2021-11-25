import { Extractor } from './base-extractor';

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
  public extract(data: any): T | undefined {
    if (typeof data !== 'object' || data === null) {
      return data;
    }
    if (Array.isArray(data)) {
      return;
    }
    return this.transformBeforeExtract(data[this.key]);
  }

  public apply(applyObject: any, value: T): void {
    applyObject[this.key] = this.transformBeforeApply(value);
  }
}
