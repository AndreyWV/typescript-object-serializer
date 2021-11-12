import { Extractor } from './extractor.base';

export class ExtractorStraight<T> extends Extractor<T> {
  public extract(data: any): T | undefined {
    if (typeof data !== 'object' || data === null) {
      return data;
    }
    if (Array.isArray(data)) {
      return;
    }
    return this.transformOnDeserialize ?
      this.transformOnDeserialize(data[this.key]) :
      data[this.key];
  }

  public apply(applyObject: any, value: T): void {
    applyObject[this.key] = this.transformOnSerialize ?
      this.transformOnSerialize(value) :
      value;
  }
}
