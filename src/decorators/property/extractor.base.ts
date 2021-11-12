export abstract class Extractor<T = any> {

  public static transform<U, E extends typeof Extractor>(
    this: E,
    transformMethods: {
      onDeserialize?: (value: any) => U,
      onSerialize?: (value: U) => any,
    },
  ): E {
    abstract class C extends this {
      protected transformOnDeserialize = transformMethods.onDeserialize;
      protected transformOnSerialize = transformMethods.onSerialize;
    };
    return C;
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
