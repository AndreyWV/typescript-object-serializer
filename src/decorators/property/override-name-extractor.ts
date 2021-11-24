import { Constructor } from '../../base-types/constructor';
import { StraightExtractor } from './straight-extractor';

export class OverrideNameExtractor<T> extends StraightExtractor<T> {

  public static use<U, E extends Constructor<OverrideNameExtractor<U>>>(
    this: E,
    property: string,
  ): E {
    return class extends this {
      constructor(...args: any[]) {
        super(property);
      }
    };
  }
}
