import { Extractor } from './base-extractor';

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
