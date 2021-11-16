import { Constructor } from '../../base-types/constructor';

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
    protected key: string | symbol,
  ) {
  }

  public abstract extract(data: any): T | undefined;
  public abstract apply(applyObject: any, value: T): void;
}
