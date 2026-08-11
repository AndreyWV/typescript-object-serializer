import { Modifier } from './modifier';

export class ExtractionResult {

  constructor(
    public readonly data: unknown,
    public readonly path: string,
  ) {
  }

};

/**
 * @class Extractor
 * @description Basic abstract class for declaring serialize/deserialize rules
 * @example
 *  class SomeExtractor extends Extractor {
 *
 *    public extract(data: unknown): ExtractionResult {
 *      // Some extract logic
 *    }
 *
 *    public apply(applyObject: Record<string, unknown>, serializedValue: unknown): void {
 *      // Some apply logic
 *    }
 *
 * }
 */
export abstract class Extractor {

  constructor(
    protected readonly key: string,
    protected readonly modifier: Modifier = new Modifier(),
  ) {
  }

  public abstract extract(data: unknown): ExtractionResult;

  public abstract apply(
    applyObject: Record<string, unknown>,
    serializedValue: unknown,
  ): void;

}
