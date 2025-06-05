import {
  ExtractionResult,
  Extractor,
} from '../../core/types/extractor';

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
export class StraightExtractor extends Extractor {
  public extract(data: unknown): ExtractionResult {
    if (typeof data !== 'object' || data === null) {
      return new ExtractionResult(
        data,
        this.key,
      );
    }
    if (Array.isArray(data)) {
      return new ExtractionResult(
        undefined,
        this.key,
      );
    } else {
      return new ExtractionResult(
        this.modifier.beforeDeserialize(data[this.key as keyof typeof data]),
        this.key,
      );
    };
  }

  public apply(applyObject: Record<string, unknown>, value: unknown): void {
    applyObject[this.key] = this.modifier.afterSerialize(value);
  }
}
