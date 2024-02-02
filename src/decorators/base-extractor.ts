import { Constructor } from '../base-types/constructor';

export type ExtractionResult<T> = {
  data: T | undefined,
  path: string,
}

/**
 * @class Extractor
 * @description Basic abstract class for declaring serialize/deserialize rules
 * @example
 *  class SomeExtractor<T = any> extends Extractor<T> {
 *
 *    public extract(data: any): T | undefined {
 *      // Some extract logic
 *    }
 *
 *    public apply(applyObject: any, value: T): void {
 *      // Some apply logic
 *    }
 *
 * }
 */
export abstract class Extractor<T = any> {

  public static transform<U, E extends Constructor<Extractor<U>>>(
    this: E,
    transformMethods: {
      onDeserialize?: (value: any) => U,
      onSerialize?: (value: U) => any,
    },
  ): E {
    return class extends (this as any) {
      protected transformOnDeserialize = transformMethods.onDeserialize;
      protected transformOnSerialize = transformMethods.onSerialize;
    } as any;
  }

  protected transformOnDeserialize?: (value: any) => T;
  protected transformOnSerialize?: (value: T) => any;

  constructor(
    protected key: string,
  ) {
  }

  public abstract extract(data: any): ExtractionResult<T>;
  public abstract apply(applyObject: any, value: T): void;

  protected transformBeforeExtract(value: any): T | undefined {
    return this.transformOnDeserialize ?
      this.transformOnDeserialize(value) :
      value;
  }

  protected transformBeforeApply(value: any): T | undefined {
    return this.transformOnSerialize ?
      this.transformOnSerialize(value) :
      value;
  }
}
