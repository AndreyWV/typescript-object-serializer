import { Extractor } from './extractor.base';

export class ExtractorSimple extends Extractor {
  public extract(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }
    if (Array.isArray(data)) {
      return;
    }
    return data[this.key];
  }

  public apply(applyObject: any, value: any): void {
    applyObject[this.key] = value;
  }
}
