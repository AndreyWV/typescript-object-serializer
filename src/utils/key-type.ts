import { Constructor } from '../base-types/constructor';
import { TypesClassStore } from '../class-stores/types-store';

export class KeyType<T> {

  public isFunction: boolean;
  public isConstructor: boolean;
  public keyConstructor?: Constructor<T>;
  private keyTypeFunction: (objectData: any) => any;

  constructor(
    private store: TypesClassStore<T>,
    private instance: any,
    private key: keyof T,
  ) {
    this.init();
  }

  private static isConstructor(isConstructorSomething: any): boolean {
    if (typeof isConstructorSomething !== 'function') {
      return false;
    }
    try {
      isConstructorSomething();
      return false;
    } catch {
      return true;
    }
  }

  public getTypeFromFunction(objectData: any): any {
    try {
      return this.keyTypeFunction(objectData);
    } catch {
    }
  }

  private init() {
    const keyTypeFunctionOrConstructor = this.store.findStoreMap()?.get(this.key) ||
      (
        (Reflect as any).getMetadata &&
        (Reflect as any).getMetadata('design:type', this.instance, this.key)
      );
    this.isConstructor = KeyType.isConstructor(keyTypeFunctionOrConstructor);
    this.isFunction = !this.isConstructor && typeof keyTypeFunctionOrConstructor === 'function';

    if (this.isConstructor) {
      this.keyConstructor = keyTypeFunctionOrConstructor;
    } else if (this.isFunction) {
      this.keyTypeFunction = keyTypeFunctionOrConstructor;
    }
  }

}
