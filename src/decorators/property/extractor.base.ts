export abstract class Extractor {

  constructor(
    protected key: string | symbol,
  ) {
  }

  public abstract extract(data: any): any;
  public abstract apply(applyObject: any, value: any): void;
}
